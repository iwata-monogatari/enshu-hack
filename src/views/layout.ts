// ============================================================
// 共通レイアウト（全ページ：非公式免責 + 運営者表示）
// ============================================================

import type { Municipality } from '../types';
import { esc } from '../util';

const STYLE = `
:root{--green:#1f6f54;--green-d:#15503c;--bg:#f6f7f5;--card:#fff;--ink:#222;--mut:#667;--line:#e3e6e1;--accent:#ffd34d}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,"Hiragino Kaku Gothic ProN","Yu Gothic UI",Meiryo,sans-serif;color:var(--ink);background:var(--bg);line-height:1.7}
a{color:var(--green-d);text-decoration:none}a:hover{text-decoration:underline}
.wrap{max-width:920px;margin:0 auto;padding:0 16px}
header.site{background:var(--green);color:#fff}
header.site .wrap{display:flex;align-items:center;gap:12px;padding:14px 16px}
header.site .logo{font-weight:800;font-size:20px;color:#fff}
header.site .tag{font-size:12px;opacity:.85}
nav.cats{background:var(--green-d)}
nav.cats .wrap{display:flex;flex-wrap:wrap;gap:2px;padding:0 16px}
nav.cats a{color:#eafaf3;padding:10px 12px;font-size:14px;font-weight:600}
nav.cats a:hover{background:rgba(255,255,255,.12);text-decoration:none}
.disclaimer{background:#fff8e6;border-bottom:1px solid #f0e2b8;color:#705a13;font-size:12.5px}
.disclaimer .wrap{padding:8px 16px}
main{padding:22px 0 40px}
h1.page{font-size:22px;margin:6px 0 4px}
h2.sec{font-size:17px;border-left:5px solid var(--green);padding-left:10px;margin:26px 0 12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin:10px 0}
.card .meta{font-size:12px;color:var(--mut);margin-top:4px}
.badge{display:inline-block;font-size:11px;font-weight:700;border-radius:6px;padding:1px 7px;margin-right:6px;vertical-align:middle}
.b-Aplus{background:#1f6f54;color:#fff}.b-A{background:#3a8f72;color:#fff}.b-B{background:#7d8a83;color:#fff}.b-C{background:#e7ebe8;color:#445}
.official-link{display:inline-flex;align-items:center;gap:6px;background:#eef6f2;border:1px solid #cfe5da;border-radius:8px;padding:8px 12px;font-size:13.5px;font-weight:600;margin-top:8px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}
.tile{background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px 14px}
.tile .n{font-size:12px;color:var(--mut)}
.update-item{padding:9px 0;border-bottom:1px dashed var(--line)}
.update-item:last-child{border-bottom:0}
.update-item .ct{font-size:11px;font-weight:700;color:#fff;background:#3a8f72;border-radius:5px;padding:1px 6px;margin-right:6px}
.ct-added{background:#1f6f54}.ct-updated{background:#c08a1e}.ct-title_changed{background:#7d8a83}.ct-category_changed{background:#7d8a83}
.empty{color:var(--mut);font-size:14px;padding:10px 0}
footer.site{background:#222;color:#cfd6d1;font-size:13px;margin-top:30px}
footer.site .wrap{padding:20px 16px}
footer.site a{color:#9fe3c8}
.care-cta{background:#f0f7f3;border:1px solid #cfe5da;border-radius:10px;padding:14px 16px;margin:16px 0}
.care-cta b{color:var(--green-d)}
.muted{color:var(--mut)}
`;

export function disclaimerText(muni: Municipality): string {
  return `${muni.short_name}ハックは${muni.name}公式サイトではありません。${muni.name}が公開している公式情報をもとに、市民の皆さまが必要な情報へたどり着きやすいよう整理・解説する民間運営の地域情報サイトです。最新・正確な情報は必ず公式ページで確認してください。`;
}

export interface LayoutOpts {
  muni: Municipality;
  title: string;
  body: string;
  categoriesNav?: Array<{ id: string; name: string }>;
  isEnshu?: boolean;
}

export function layout(opts: LayoutOpts): string {
  const { muni, title, body, categoriesNav = [], isEnshu = false } = opts;
  const base = isEnshu ? '/enshu' : `/${muni.slug}`;
  const brand = isEnshu ? '遠州ハック' : `${muni.short_name}ハック`;
  const nav = categoriesNav
    .map((c) => `<a href="${base}/category/${esc(c.id)}/">${esc(c.name)}</a>`)
    .join('');
  return `<!doctype html><html lang="ja"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} | ${esc(brand)}</title>
<meta name="description" content="${esc(disclaimerText(muni))}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>${STYLE}</style>
</head><body>
<header class="site"><div class="wrap">
  <a class="logo" href="${base}/">${esc(brand)}</a>
  <span class="tag">${isEnshu ? '遠州エリア統合ポータル' : `${esc(muni.name)}の暮らしの情報を、たどりやすく`}</span>
</div></header>
${nav ? `<nav class="cats"><div class="wrap">${nav}</div></nav>` : ''}
<div class="disclaimer"><div class="wrap">⚠ ${esc(disclaimerText(muni))}</div></div>
<main><div class="wrap">${body}</div></main>
<footer class="site"><div class="wrap">
  <div><b style="color:#fff">${esc(brand)}</b></div>
  <div class="muted" style="margin:6px 0 10px">運営：富士ヶ丘サービス ／ 代表：大石浩之</div>
  <div>${isEnshu ? '' : `<a href="${esc(muni.official_base_url)}" rel="noopener">${esc(muni.name)}公式サイト ↗</a> ／ `}<a href="/enshu/">遠州ハック</a></div>
  <div class="muted" style="margin-top:10px;font-size:12px">本サイトは公式情報の転載サイトではありません。公式情報を整理・分類し、最終的に必ず公式ページへご案内します。</div>
</div></footer>
</body></html>`;
}

export function priorityBadge(p: string | null): string {
  switch (p) {
    case 'A+':
      return '<span class="badge b-Aplus">A+ 重要</span>';
    case 'A':
      return '<span class="badge b-A">A</span>';
    case 'B':
      return '<span class="badge b-B">B</span>';
    case 'C':
      return '<span class="badge b-C">公式案内</span>';
    default:
      return '';
  }
}

export function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' },
  });
}
