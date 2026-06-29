// ============================================================
// ユーティリティ
// ============================================================

/** SHA-256 16進文字列（Web Crypto, Workers 標準） */
export async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** URLから決定的な短いID（再クロール時にupsertできる） */
export async function pageId(municipalityId: string, url: string): Promise<string> {
  return `${municipalityId}__${(await sha256(url)).slice(0, 20)}`;
}

export function uuid(): string {
  return crypto.randomUUID();
}

/** 現在時刻（ISO8601, UTC） */
export function nowISO(): string {
  return new Date().toISOString();
}

/** HTMLエスケープ */
export function esc(s: string | null | undefined): string {
  if (s == null) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 相対URLを絶対URLへ解決。失敗時はnull。 */
export function resolveUrl(href: string, base: string): string | null {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

/** URLからスラッグ生成（記事URL用）。パス末尾＋ハッシュで一意化。 */
export async function slugFromUrl(url: string): Promise<string> {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter((p) => p && p !== 'index.html');
    const tail = parts.slice(-2).join('-').replace(/\.html?$/, '') || 'page';
    const safe = tail.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'page';
    return `${safe}-${(await sha256(url)).slice(0, 8)}`;
  } catch {
    return `page-${(await sha256(url)).slice(0, 8)}`;
  }
}

/** ISO日時を「YYYY/MM/DD」表記へ（表示用, JST） */
export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, '0');
  const day = String(jst.getUTCDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

/** YYYY-MM-DD（JST）の当日文字列 */
export function todayJST(now = new Date()): string {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 10);
}
