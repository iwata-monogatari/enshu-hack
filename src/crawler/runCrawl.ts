// ============================================================
// クロール・オーケストレーション
// 設計書「クロール設計」1〜11 を実装。
// ============================================================

import type { Env, Municipality, CrawlReport, Priority } from '../types';
import { LEVEL_BY_PRIORITY } from '../config';
import {
  getActiveMunicipalities,
  getCategoryMappings,
  getMunicipalityBySlug,
  getPagesByMunicipality,
} from '../db/queries';
import { fetchSitemap } from './fetchSitemap';
import { classifyPage } from './classifyPriority';
import { fetchPageMeta } from './parsePage';
import { detectChanges, type IncomingPage } from './detectChanges';
import { nowISO, pageId, slugFromUrl, uuid } from '../util';

/** is_active=1 の全自治体（初期は磐田のみ）をクロール */
export async function crawlActive(env: Env): Promise<CrawlReport[]> {
  const munis = await getActiveMunicipalities(env.DB);
  const reports: CrawlReport[] = [];
  for (const muni of munis) reports.push(await crawlMunicipality(env, muni));
  return reports;
}

export async function crawlBySlug(env: Env, slug: string): Promise<CrawlReport | null> {
  const muni = await getMunicipalityBySlug(env.DB, slug);
  if (!muni) return null;
  return await crawlMunicipality(env, muni);
}

export async function crawlMunicipality(env: Env, muni: Municipality): Promise<CrawlReport> {
  const startedAt = nowISO();
  const maxPages = Math.max(1, parseInt(env.MAX_PAGES_PER_RUN || '400', 10) || 400);
  const report: CrawlReport = {
    municipalityId: muni.id,
    startedAt,
    finishedAt: startedAt,
    fetchedFromSitemap: 0,
    excludedD: 0,
    counts: { 'A+': 0, A: 0, B: 0, C: 0 },
    saved: 0,
    changes: { added: 0, updated: 0, removed: 0, title_changed: 0, category_changed: 0 },
    articleSlots: 0,
    enshuIndexed: 0,
    errors: [],
  };

  try {
    // 2-3) サイトマップ取得 → URL一覧
    const entries = await fetchSitemap(muni);
    report.fetchedFromSitemap = entries.length;
    if (entries.length === 0) {
      report.errors.push('サイトマップからURLを取得できませんでした');
      report.finishedAt = nowISO();
      return report;
    }

    const mappings = await getCategoryMappings(env.DB, muni.id);

    // 4) D除外しつつ分類。C以上のみ対象。
    const classified = entries
      .map((e) => classifyPage(e, muni.official_base_url, mappings))
      .filter((c) => {
        if (c.priority === 'D') {
          report.excludedD++;
          return false;
        }
        return true;
      });

    // 本文取得の上限を適用（A+ > A > B > C の順で優先）
    const order: Record<Priority, number> = { 'A+': 0, A: 1, B: 2, C: 3, D: 9 };
    classified.sort((a, b) => order[a.priority] - order[b.priority]);
    const targets = classified.slice(0, maxPages);
    if (classified.length > maxPages) {
      report.errors.push(`本文取得を ${maxPages} 件に制限（候補 ${classified.length} 件）`);
    }

    // 5) title / updated_at / content_hash 取得 → IncomingPage化
    const incoming: IncomingPage[] = [];
    for (const c of targets) {
      const meta = await fetchPageMeta(c.url, c.title);
      const id = await pageId(muni.id, c.url);
      incoming.push({
        id,
        url: c.url,
        title: meta.title || c.title,
        categoryId: c.categoryId,
        priority: c.priority,
        contentHash: meta.contentHash,
      });
      report.counts[c.priority as 'A+' | 'A' | 'B' | 'C']++;
      // メタは保存時に使うので一時付与
      (c as any)._meta = meta;
      (c as any)._id = id;
    }

    // 7-8) 差分検知（保存前の既存状態と突き合わせ）
    const existing = await getPagesByMunicipality(env.DB, muni.id);
    const changes = detectChanges(existing, incoming);

    // 6) official_pages へ保存（upsert）
    const checkedAt = nowISO();
    const stmts: D1PreparedStatement[] = [];
    for (const c of targets) {
      const id = (c as any)._id as string;
      const meta = (c as any)._meta as { officialUpdatedAt: string | null; contentHash: string; title: string | null };
      const existedRow = existing.find((p) => p.official_url === c.url);
      const firstSeen = existedRow?.first_seen_at ?? checkedAt;
      const articleStatus = c.priority === 'C' ? 'link_only' : 'pending';
      stmts.push(
        env.DB.prepare(
          `INSERT INTO official_pages
             (id, municipality_id, official_url, title, category, subcategory, page_type,
              priority, official_updated_at, first_seen_at, last_checked_at, content_hash,
              article_status, is_public)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,1)
           ON CONFLICT(municipality_id, official_url) DO UPDATE SET
             title=excluded.title,
             category=excluded.category,
             subcategory=excluded.subcategory,
             priority=excluded.priority,
             official_updated_at=excluded.official_updated_at,
             last_checked_at=excluded.last_checked_at,
             content_hash=excluded.content_hash,
             article_status=excluded.article_status`,
        ).bind(
          id,
          muni.id,
          c.url,
          meta.title || c.title,
          c.categoryId,
          c.subcategory,
          'official',
          c.priority,
          meta.officialUpdatedAt,
          firstSeen,
          checkedAt,
          meta.contentHash,
          articleStatus,
        ),
      );
      report.saved++;

      // 9) A+ / A / B は hack_articles の枠を生成（記事化可能な状態）
      if (c.priority !== 'C') {
        const slug = await slugFromUrl(c.url);
        const level = LEVEL_BY_PRIORITY[c.priority] || 'short';
        stmts.push(
          env.DB.prepare(
            `INSERT INTO hack_articles
               (id, municipality_id, official_page_id, slug, title, summary, body, status, generated_level, last_generated, published_at)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)
             ON CONFLICT(municipality_id, slug) DO UPDATE SET
               title=excluded.title, generated_level=excluded.generated_level`,
          ).bind(
            await pageId(muni.id, 'art:' + c.url),
            muni.id,
            id,
            slug,
            meta.title || c.title,
            null,
            null,
            'pending',
            level,
            null,
            null,
          ),
        );
        report.articleSlots++;
      }

      // 11) enshu_index 更新（C含む公開ページを統合インデックスへ）
      stmts.push(
        env.DB.prepare(
          `INSERT INTO enshu_index
             (id, municipality_id, official_page_id, hack_article_id, normalized_category_id, title, summary, url, priority, updated_at)
           VALUES (?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(municipality_id, url) DO UPDATE SET
             title=excluded.title, normalized_category_id=excluded.normalized_category_id,
             priority=excluded.priority, updated_at=excluded.updated_at`,
        ).bind(
          await pageId(muni.id, 'enshu:' + c.url),
          muni.id,
          id,
          null, // hack_article_id
          c.categoryId, // normalized_category_id
          meta.title || c.title, // title
          null, // summary
          c.url,
          c.priority,
          meta.officialUpdatedAt || checkedAt,
        ),
      );
      report.enshuIndexed++;
    }

    // 差分を daily_changes に保存
    for (const ch of changes) {
      report.changes[ch.changeType]++;
      stmts.push(
        env.DB.prepare(
          `INSERT INTO daily_changes
             (id, municipality_id, official_page_id, detected_at, change_type, previous_hash, current_hash,
              title_snapshot, official_url_snapshot, priority_snapshot)
           VALUES (?,?,?,?,?,?,?,?,?,?)`,
        ).bind(
          uuid(),
          muni.id,
          ch.officialPageId,
          checkedAt,
          ch.changeType,
          ch.previousHash,
          ch.currentHash,
          ch.titleSnapshot,
          ch.officialUrlSnapshot,
          ch.prioritySnapshot,
        ),
      );
    }

    // removed のページは非公開化
    for (const ch of changes) {
      if (ch.changeType === 'removed' && ch.officialPageId) {
        stmts.push(
          env.DB.prepare('UPDATE official_pages SET is_public = 0, last_checked_at = ? WHERE id = ?').bind(
            checkedAt,
            ch.officialPageId,
          ),
        );
      }
    }

    // D1 バッチ実行（100件ずつ）
    for (let i = 0; i < stmts.length; i += 100) {
      await env.DB.batch(stmts.slice(i, i + 100));
    }
  } catch (e: any) {
    report.errors.push(`例外: ${e?.message || String(e)}`);
  }

  report.finishedAt = nowISO();
  return report;
}
