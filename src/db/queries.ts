// ============================================================
// D1 クエリヘルパー
// ============================================================

import type {
  Category,
  CategoryMapping,
  DailyChange,
  Municipality,
  OfficialPage,
  TroubleGuideRow,
  ProcedureStepRow,
  FeedbackType,
} from '../types';
import { TROUBLE_GUIDES, LAST_VERIFIED } from '../data/troubleGuides';
import { nowISO, uuid } from '../util';

export async function getActiveMunicipalities(db: D1Database): Promise<Municipality[]> {
  const r = await db
    .prepare('SELECT * FROM municipalities WHERE is_active = 1 ORDER BY display_order')
    .all<Municipality>();
  return r.results ?? [];
}

export async function getAllMunicipalities(db: D1Database): Promise<Municipality[]> {
  const r = await db.prepare('SELECT * FROM municipalities ORDER BY display_order').all<Municipality>();
  return r.results ?? [];
}

export async function getMunicipalityBySlug(db: D1Database, slug: string): Promise<Municipality | null> {
  return await db.prepare('SELECT * FROM municipalities WHERE slug = ?').bind(slug).first<Municipality>();
}

export async function getCategoryMappings(db: D1Database, municipalityId: string): Promise<CategoryMapping[]> {
  const r = await db
    .prepare('SELECT * FROM category_mappings WHERE municipality_id = ?')
    .bind(municipalityId)
    .all<CategoryMapping>();
  return r.results ?? [];
}

export async function getCategories(db: D1Database): Promise<Category[]> {
  const r = await db.prepare('SELECT * FROM categories ORDER BY display_order').all<Category>();
  return r.results ?? [];
}

export async function getCategory(db: D1Database, id: string): Promise<Category | null> {
  return await db.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first<Category>();
}

export async function getPagesByMunicipality(db: D1Database, municipalityId: string): Promise<OfficialPage[]> {
  const r = await db
    .prepare('SELECT * FROM official_pages WHERE municipality_id = ?')
    .bind(municipalityId)
    .all<OfficialPage>();
  return r.results ?? [];
}

export async function getPublicPagesByCategory(
  db: D1Database,
  municipalityId: string,
  categoryId: string,
): Promise<OfficialPage[]> {
  const r = await db
    .prepare(
      `SELECT * FROM official_pages
       WHERE municipality_id = ? AND category = ? AND is_public = 1
       ORDER BY CASE priority WHEN 'A+' THEN 0 WHEN 'A' THEN 1 WHEN 'B' THEN 2 ELSE 3 END,
                official_updated_at DESC`,
    )
    .bind(municipalityId, categoryId)
    .all<OfficialPage>();
  return r.results ?? [];
}

export async function getPageById(db: D1Database, id: string): Promise<OfficialPage | null> {
  return await db.prepare('SELECT * FROM official_pages WHERE id = ?').bind(id).first<OfficialPage>();
}

/** カテゴリ別の公開ページ件数（トップ/カテゴリナビ用） */
export async function getCategoryCounts(
  db: D1Database,
  municipalityId: string,
): Promise<Record<string, number>> {
  const r = await db
    .prepare(
      `SELECT category AS id, COUNT(*) AS n FROM official_pages
       WHERE municipality_id = ? AND is_public = 1 AND category IS NOT NULL
       GROUP BY category`,
    )
    .bind(municipalityId)
    .all<{ id: string; n: number }>();
  const out: Record<string, number> = {};
  for (const row of r.results ?? []) out[row.id] = row.n;
  return out;
}

/**
 * sinceISO 以降の差分（「本日の更新」用）。
 * detected_at はUTC ISO で保存されるため、TZに依存しないよう
 * カレンダー日ではなく「直近N時間」の絶対時刻で絞り込む。
 */
export async function getChangesSince(
  db: D1Database,
  municipalityIds: string[],
  sinceISO: string,
  limit = 50,
): Promise<DailyChange[]> {
  if (municipalityIds.length === 0) return [];
  const placeholders = municipalityIds.map(() => '?').join(',');
  const r = await db
    .prepare(
      `SELECT * FROM daily_changes
       WHERE municipality_id IN (${placeholders})
          AND change_type != 'removed'
          AND detected_at >= ?
       ORDER BY detected_at DESC LIMIT ?`,
    )
    .bind(...municipalityIds, sinceISO, limit)
    .all<DailyChange>();
  return r.results ?? [];
}

export async function getRecentChanges(
  db: D1Database,
  municipalityIds: string[],
  limit = 20,
): Promise<DailyChange[]> {
  if (municipalityIds.length === 0) return [];
  const placeholders = municipalityIds.map(() => '?').join(',');
  const r = await db
    .prepare(
      `SELECT * FROM daily_changes
       WHERE municipality_id IN (${placeholders}) AND change_type != 'removed'
       ORDER BY detected_at DESC LIMIT ?`,
    )
    .bind(...municipalityIds, limit)
    .all<DailyChange>();
  return r.results ?? [];
}

export async function getArticleBySlug(db: D1Database, municipalityId: string, slug: string) {
  return await db
    .prepare('SELECT * FROM hack_articles WHERE municipality_id = ? AND slug = ?')
    .bind(municipalityId, slug)
    .first();
}

/** 遠州ハック: 有効自治体のインデックスをカテゴリ別に取得 */
export async function getEnshuIndex(db: D1Database, categoryId?: string, limit = 200) {
  if (categoryId) {
    const r = await db
      .prepare(
        `SELECT e.*, m.short_name AS muni_short FROM enshu_index e
         JOIN municipalities m ON m.id = e.municipality_id
         WHERE m.is_active = 1 AND e.normalized_category_id = ?
         ORDER BY e.updated_at DESC LIMIT ?`,
      )
      .bind(categoryId, limit)
      .all();
    return r.results ?? [];
  }
  const r = await db
    .prepare(
      `SELECT e.*, m.short_name AS muni_short FROM enshu_index e
       JOIN municipalities m ON m.id = e.municipality_id
       WHERE m.is_active = 1
       ORDER BY e.updated_at DESC LIMIT ?`,
    )
    .bind(limit)
    .all();
  return r.results ?? [];
}

// ===== 困りごと（スマホファースト v1.0） ====================

import { LIFE_DATA } from '../data/lifeData';
import type { LifeCategoryRow, LifeTopicRow } from '../types';

/** 大項目一覧の取得 */
export async function getLifeCategories(db: D1Database, municipalityId: string): Promise<LifeCategoryRow[]> {
  const r = await db
    .prepare('SELECT * FROM life_categories WHERE municipality_id = ? ORDER BY display_order')
    .bind(municipalityId)
    .all<LifeCategoryRow>();
  return r.results ?? [];
}

/** カテゴリ別中項目一覧の取得 */
export async function getLifeTopicsByCategory(
  db: D1Database,
  municipalityId: string,
  categoryId: string
): Promise<LifeTopicRow[]> {
  const r = await db
    .prepare('SELECT * FROM life_topics WHERE municipality_id = ? AND category_id = ? AND status = \'published\' ORDER BY display_order')
    .bind(municipalityId, categoryId)
    .all<LifeTopicRow>();
  return r.results ?? [];
}

/** スラッグによる中項目の取得 */
export async function getLifeTopicBySlug(
  db: D1Database,
  municipalityId: string,
  slug: string
): Promise<LifeTopicRow | null> {
  return await db
    .prepare('SELECT * FROM life_topics WHERE municipality_id = ? AND slug = ?')
    .bind(municipalityId, slug)
    .first<LifeTopicRow>();
}

/** 中項目IDによるトラブルガイドの取得 */
export async function getTroubleGuideByTopic(
  db: D1Database,
  municipalityId: string,
  topicId: string
): Promise<TroubleGuideRow | null> {
  return await db
    .prepare('SELECT * FROM trouble_guides WHERE municipality_id = ? AND topic_id = ?')
    .bind(municipalityId, topicId)
    .first<TroubleGuideRow>();
}

/** スラッグによるトラブルガイドの取得 */
export async function getTroubleGuide(
  db: D1Database,
  municipalityId: string,
  slug: string
): Promise<TroubleGuideRow | null> {
  return await db
    .prepare('SELECT * FROM trouble_guides WHERE municipality_id = ? AND slug = ?')
    .bind(municipalityId, slug)
    .first<TroubleGuideRow>();
}

/** 手順ステップの取得 */
export async function getProcedureSteps(
  db: D1Database,
  troubleGuideId: string
): Promise<ProcedureStepRow[]> {
  const r = await db
    .prepare('SELECT * FROM procedure_steps WHERE trouble_guide_id = ? ORDER BY step_order')
    .bind(troubleGuideId)
    .all<ProcedureStepRow>();
  return r.results ?? [];
}

/** フィードバック記録（個人情報なし） */
export async function insertFeedback(
  db: D1Database,
  municipalityId: string,
  troubleGuideId: string | null,
  feedbackType: FeedbackType,
  freeword: string | null
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO feedback_logs (id, municipality_id, trouble_guide_id, feedback_type, freeword, created_at)
       VALUES (?,?,?,?,?,?)`
    )
    .bind(uuid(), municipalityId, troubleGuideId, feedbackType, freeword, nowISO())
    .run();
}

/**
 * 困りごとデータ（lifeData.ts）をDBへ投入（upsert）。
 * D1 Database batch を使って一括実行し、タイムアウトを防ぎます。
 */
function resolveConsultType(categorySlug: string, topicSlug: string, explicit?: string): string {
  if (explicit) return explicit;
  if (categorySlug === 'housing') return 'real_estate';
  if (categorySlug === 'parents-care') return 'nursing';
  if (categorySlug === 'end-of-life') {
    const realEstateTopics = new Set(['inheritance', 'inherited-house', 'house-became-vacant', 'property-tax-inheritance']);
    if (realEstateTopics.has(topicSlug)) return 'real_estate';
  }
  return 'other';
}

export async function seedTroubleGuides(
  db: D1Database,
  municipalityId: string
): Promise<{ categories: number; topics: number; guides: number; steps: number }> {
  const now = nowISO();
  let categoryCount = 0;
  let topicCount = 0;
  let guideCount = 0;
  let stepCount = 0;

  const statements: D1PreparedStatement[] = [];

  for (let cIdx = 0; cIdx < LIFE_DATA.length; cIdx++) {
    const cat = LIFE_DATA[cIdx];
    const catId = `${municipalityId}__lc__${cat.slug}`;

    // 1. 大項目登録
    statements.push(
      db
        .prepare(
          `INSERT INTO life_categories (id, municipality_id, slug, title, subtitle, icon, display_order, is_featured, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(municipality_id, slug) DO UPDATE SET
             title=excluded.title, subtitle=excluded.subtitle, icon=excluded.icon, display_order=excluded.display_order, updated_at=excluded.updated_at`
        )
        .bind(catId, municipalityId, cat.slug, cat.title, cat.subtitle, cat.icon, cIdx + 1, 0, now, now)
    );
    categoryCount++;

    for (let tIdx = 0; tIdx < cat.topics.length; tIdx++) {
      const top = cat.topics[tIdx];
      const topicId = `${municipalityId}__lt__${top.slug}`;

      // 2. 中項目登録
      statements.push(
        db
          .prepare(
            `INSERT INTO life_topics (id, municipality_id, category_id, slug, title, icon, summary, display_order, rank, status, consult_type, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(municipality_id, slug) DO UPDATE SET
               title=excluded.title, icon=excluded.icon, summary=excluded.summary, display_order=excluded.display_order, rank=excluded.rank, status=excluded.status, consult_type=excluded.consult_type, updated_at=excluded.updated_at`
          )
          .bind(topicId, municipalityId, catId, top.slug, top.title, top.icon, top.summary, tIdx + 1, top.rank, 'published', resolveConsultType(cat.slug, top.slug, top.consult_type), now, now)
      );
      topicCount++;

      // 3. トラブルガイド登録
      const guideId = `${municipalityId}__tg__${top.slug}`;
      const todayText = top.today_tasks ? top.today_tasks.join('\n') : '';
      const thisWeekText = top.this_week_tasks ? top.this_week_tasks.join('\n') : '';
      const laterText = top.later_tasks ? top.later_tasks.join('\n') : '';
      const requiredText = top.required_items ? top.required_items.join('\n') : '';
      const officialSources = top.official_sources || '';

      statements.push(
        db
          .prepare(
            `INSERT INTO trouble_guides (
              id, municipality_id, topic_id, slug, title, summary, who_needs_this, first_action,
              today_tasks, this_week_tasks, later_tasks, required_items, municipal_window,
              outside_agencies, caution, official_sources, last_verified_at, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(municipality_id, slug) DO UPDATE SET
              title=excluded.title, summary=excluded.summary, who_needs_this=excluded.who_needs_this,
              first_action=excluded.first_action, today_tasks=excluded.today_tasks, this_week_tasks=excluded.this_week_tasks,
              later_tasks=excluded.later_tasks, required_items=excluded.required_items, municipal_window=excluded.municipal_window,
              outside_agencies=excluded.outside_agencies, caution=excluded.caution, official_sources=excluded.official_sources,
              last_verified_at=excluded.last_verified_at, status=excluded.status, updated_at=excluded.updated_at`
          )
          .bind(
            guideId,
            municipalityId,
            topicId,
            top.slug,
            top.title,
            top.summary,
            top.who_needs_this,
            top.first_action,
            todayText,
            thisWeekText,
            laterText,
            requiredText,
            top.municipal_window || null,
            top.outside_agencies || null,
            top.caution || null,
            officialSources,
            '2026-06-29',
            'published',
            now,
            now
          )
      );
      guideCount++;

      // 4. 手順ステップの登録
      statements.push(db.prepare('DELETE FROM procedure_steps WHERE trouble_guide_id = ?').bind(guideId));

      let sIdx = 1;
      if (top.today_tasks) {
        for (const t of top.today_tasks) {
          statements.push(
            db
              .prepare(
                `INSERT INTO procedure_steps (id, trouble_guide_id, step_order, timing, task_name, window_name, is_municipal)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
              )
              .bind(`${guideId}__s${sIdx}`, guideId, sIdx, 'today', t, top.municipal_window || null, top.municipal_window ? 1 : 0)
          );
          sIdx++;
          stepCount++;
        }
      }
      if (top.this_week_tasks) {
        for (const t of top.this_week_tasks) {
          statements.push(
            db
              .prepare(
                `INSERT INTO procedure_steps (id, trouble_guide_id, step_order, timing, task_name, window_name, is_municipal)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
              )
              .bind(`${guideId}__s${sIdx}`, guideId, sIdx, 'this_week', t, top.municipal_window || null, top.municipal_window ? 1 : 0)
          );
          sIdx++;
          stepCount++;
        }
      }
      if (top.later_tasks) {
        for (const t of top.later_tasks) {
          statements.push(
            db
              .prepare(
                `INSERT INTO procedure_steps (id, trouble_guide_id, step_order, timing, task_name, window_name, is_municipal)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
              )
              .bind(`${guideId}__s${sIdx}`, guideId, sIdx, 'later', t, top.municipal_window || null, top.municipal_window ? 1 : 0)
          );
          sIdx++;
          stepCount++;
        }
      }
    }
  }

  // 最後に一括バッチ実行
  await db.batch(statements);

  return { categories: categoryCount, topics: topicCount, guides: guideCount, steps: stepCount };
}
