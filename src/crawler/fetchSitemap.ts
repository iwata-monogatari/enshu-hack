// ============================================================
// サイトマップ取得 → URL一覧抽出
// XML(sitemapindex / urlset) と HTML(サイトマップページ) の両対応。
// ============================================================

import type { Municipality, SitemapEntry } from '../types';
import { resolveUrl } from '../util';

const UA = 'iwata-hack-bot/1.1 (+https://iwata-hack.pages.dev; 民間運営の地域情報サイト)';

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html,application/xml' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

/** <loc> をすべて取り出す（XMLサイトマップ用） */
function extractLocs(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) out.push(m[1].trim());
  return out;
}

/** HTMLから <a href> + リンクテキストを抽出 */
function extractAnchors(html: string, base: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const seen = new Set<string>();
  const re = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const abs = resolveUrl(m[1], base);
    if (!abs) continue;
    // 同一ホストのみ・アンカー/JS/メールを除外
    if (!isSameHost(abs, base)) continue;
    if (/^(javascript:|mailto:|tel:)/i.test(m[1]) || m[1].startsWith('#')) continue;
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const clean = abs.split('#')[0];
    if (seen.has(clean)) continue;
    seen.add(clean);
    entries.push({ url: clean, title: text || clean });
  }
  return entries;
}

function isSameHost(url: string, base: string): boolean {
  try {
    return new URL(url).host === new URL(base).host;
  } catch {
    return false;
  }
}

/**
 * 自治体のサイトマップを取得してページ一覧を返す。
 * 取得順:
 *  1. sitemap_url が設定済み → それを取得（HTML/XML自動判定）
 *  2. /sitemap.xml を試行
 *  3. /sitemap.html を試行
 * XMLがsitemapindexなら子サイトマップを最大10件まで展開。
 */
export async function fetchSitemap(muni: Municipality): Promise<SitemapEntry[]> {
  const base = muni.official_base_url;
  const candidates: string[] = [];
  if (muni.sitemap_url) candidates.push(muni.sitemap_url);
  candidates.push(resolveUrl('/sitemap.xml', base)!);
  candidates.push(resolveUrl('/sitemap.html', base)!);

  for (const url of candidates) {
    try {
      const body = await fetchText(url);
      const looksXml = /<urlset|<sitemapindex|<\?xml/i.test(body.slice(0, 500));
      if (looksXml) {
        const entries = await parseXmlSitemap(body, base);
        if (entries.length) return entries;
      } else {
        const entries = extractAnchors(body, base);
        if (entries.length) return entries;
      }
    } catch {
      // 次の候補へ
    }
  }
  return [];
}

async function parseXmlSitemap(xml: string, base: string): Promise<SitemapEntry[]> {
  // sitemapindex → 子サイトマップを展開
  if (/<sitemapindex/i.test(xml)) {
    const children = extractLocs(xml).slice(0, 10);
    const all: SitemapEntry[] = [];
    const seen = new Set<string>();
    for (const child of children) {
      try {
        const body = await fetchText(child);
        for (const loc of extractLocs(body)) {
          if (seen.has(loc)) continue;
          seen.add(loc);
          all.push({ url: loc, title: titleFromUrl(loc) });
        }
      } catch {
        /* skip */
      }
    }
    return all;
  }
  // urlset
  return extractLocs(xml).map((loc) => ({ url: loc, title: titleFromUrl(loc) }));
}

/** XMLサイトマップにはタイトルが無いのでURLから暫定タイトルを作る */
function titleFromUrl(url: string): string {
  try {
    const p = new URL(url).pathname.split('/').filter(Boolean);
    return decodeURIComponent(p[p.length - 1] || url);
  } catch {
    return url;
  }
}
