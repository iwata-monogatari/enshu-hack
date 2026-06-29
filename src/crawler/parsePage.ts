// ============================================================
// 個別ページ取得 → title / updated_at / content_hash
// 公式文章は丸写ししない。本文はハッシュ化のみに使い保存しない。
// ============================================================

import { sha256 } from '../util';

const UA = 'iwata-hack-bot/1.1 (+https://iwata-hack.pages.dev; 民間運営の地域情報サイト)';

export interface PageMeta {
  title: string | null;
  officialUpdatedAt: string | null;
  contentHash: string;
}

/** <title> 抽出 */
function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  return m[1]
    .replace(/\s+/g, ' ')
    .replace(/\s*[|｜\-－]\s*磐田市.*$/, '') // 「ページ名 | 磐田市」のサイト名部分を除去
    .trim() || null;
}

/** 更新日メタ（最終更新日 / og:updated_time / Last-Modified）を推定 */
function extractUpdatedAt(html: string, lastModifiedHeader: string | null): string | null {
  const metas = [
    /<meta[^>]+property=["']article:modified_time["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+property=["']og:updated_time["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']last-modified["'][^>]+content=["']([^"']+)["']/i,
  ];
  for (const re of metas) {
    const m = html.match(re);
    if (m) return normalizeDate(m[1]);
  }
  // 本文中の「更新日 2024年5月1日」「最終更新日：2024/05/01」等
  const jp = html.match(/(?:最終)?更新日[:：\s]*?(\d{4})[年\/\-](\d{1,2})[月\/\-](\d{1,2})/);
  if (jp) {
    const [, y, mo, d] = jp;
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  if (lastModifiedHeader) return normalizeDate(lastModifiedHeader);
  return null;
}

function normalizeDate(s: string): string | null {
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

/** <body> から主要テキストを抽出（ナビ/スクリプト除去）。ハッシュ用。 */
function mainText(html: string): string {
  let body = html;
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) body = bodyMatch[1];
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * ページを取得しメタ情報を返す。
 * 取得失敗時は url を種にした content_hash を返し、最低限の差分検知を維持。
 */
export async function fetchPageMeta(url: string, fallbackTitle: string): Promise<PageMeta> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html' },
    });
    if (!res.ok) {
      return { title: fallbackTitle || null, officialUpdatedAt: null, contentHash: await sha256(`err:${res.status}:${url}`) };
    }
    const html = await res.text();
    const text = mainText(html);
    return {
      title: extractTitle(html) || fallbackTitle || null,
      officialUpdatedAt: extractUpdatedAt(html, res.headers.get('last-modified')),
      contentHash: await sha256(text || url),
    };
  } catch {
    return { title: fallbackTitle || null, officialUpdatedAt: null, contentHash: await sha256(`fetcherr:${url}`) };
  }
}
