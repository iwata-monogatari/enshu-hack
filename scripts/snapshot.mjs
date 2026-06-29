// 本番 iwata-hack Worker を /iwata/ から BFS クロールし、静的 Pages サイトを生成する。
// /iwata プレフィックスを root 直下に平坦化。検索/AI相談など動的依存箇所を degrade。
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ORIGIN = 'https://iwata-hack.hiroyukio0122.workers.dev';
const NEW_DOMAIN = 'https://iwata.enshu-lifehack.com';
const OUT = String.raw`C:\Users\fujig\Desktop\99大石制作物\00磐田ハック\enshu-lifehack-iwata`;
const SRC_FAVICON = String.raw`C:\Users\fujig\Desktop\99大石制作物\00磐田ハック\iwata-hack\public\favicon.svg`;

// 2026-06 以降、本番 Worker は公開アクセスを新ドメインへ301する。
// 再生成時は CRAWL_TOKEN(=管理トークン) を ?token= で渡してリダイレクトをbypassし、
// 動的レンダリング結果を取得する。token は scripts/../.dev.vars から読む（repoには載せない）。
let TOKEN = process.env.SNAPSHOT_TOKEN || '';
if (!TOKEN) {
  try {
    const dv = readFileSync(new URL('../.dev.vars', import.meta.url), 'utf8');
    const m = dv.match(/^CRAWL_TOKEN=(.*)$/m);
    if (m) TOKEN = m[1].trim();
  } catch {}
}
console.log(TOKEN ? 'token: loaded (redirect bypass enabled)' : 'token: NONE (本番リダイレクト後は1ページしか取得できません)');

// クロール対象外（動的/管理/アセット）
const SKIP = (p) =>
  p.startsWith('/api') ||
  p.startsWith('/admin') ||
  p.startsWith('/iwata/navigate') ||
  p === '/sitemap.xml' ||
  p.startsWith('/favicon') ||
  p === '/robots.txt';

// /iwata プレフィックスを除去（/iwata/ -> /、/iwata/foo/ -> /foo/）
function flatten(p) {
  if (p === '/iwata' || p === '/iwata/') return '/';
  if (p.startsWith('/iwata/')) return p.slice('/iwata'.length); // -> /foo/...
  return p;
}

function normalizePath(href) {
  // クエリ・ハッシュ除去、末尾スラッシュ正規化（root以外は付与）
  let p = href.split('#')[0].split('?')[0];
  if (!p.startsWith('/')) return null;
  p = p.replace(/\/{2,}/g, '/');
  if (p !== '/' && !p.endsWith('/')) p = p + '/';
  return p;
}

function extractHrefs(html) {
  const out = [];
  const re = /href="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

function processHtml(rawHtml, flatPath) {
  let h = rawHtml;
  // 1) パス平坦化（属性値のみを対象に /iwata を除去）
  h = h.split('"/iwata/').join('"/');
  h = h.split('"/iwata"').join('"/"');
  // 2) 検索フォーム → Google サイト内検索に degrade
  h = h.replace(
    '<form class="searchbox" action="/navigate" method="get" role="search" style="margin-bottom: 28px;">',
    '<form class="searchbox" action="https://www.google.com/search" method="get" role="search" target="_blank" rel="noopener" style="margin-bottom: 28px;"><input type="hidden" name="as_sitesearch" value="iwata.enshu-lifehack.com">'
  );
  // 3) 「AIに相談する」リンク(/navigate?q=AI相談) → 相談ハブへ
  h = h.split('href="/navigate?q=AI相談"').join('href="/life/troubles-consult/"');
  // 4) 念のため残った /navigate を相談ハブへ
  h = h.split('action="/navigate"').join('action="/life/troubles-consult/"');
  h = h.split('href="/navigate').join('href="/life/troubles-consult/');
  // 5) ルートトップのみ SEO 強化タイトル/ディスクリプション
  if (flatPath === '/') {
    h = h.replace(
      /<title>[^<]*<\/title>/,
      '<title>磐田ライフハック｜磐田市の暮らし・手続き・防災・介護・住まいを市民目線で整理</title>'
    );
    h = h.replace(
      /<meta name="description" content="[^"]*">/,
      '<meta name="description" content="磐田ライフハックは、磐田市の公式情報をもとに、暮らしの手続き・防災・子育て・介護・住まいに関する情報を市民目線で整理する生活ナビです。最新・正確な情報は磐田市公式サイトをご確認ください。">'
    );
  }
  return h;
}

async function main() {
  const seeds = ['/iwata/'];
  const visited = new Set();
  const queue = [...seeds];
  const savedPaths = [];
  let count = 0;

  while (queue.length) {
    const p = queue.shift();
    if (visited.has(p)) continue;
    visited.add(p);
    if (SKIP(p)) continue;

    let res;
    try {
      const sep = p.includes('?') ? '&' : '?';
      const fetchUrl = TOKEN ? `${ORIGIN}${p}${sep}token=${encodeURIComponent(TOKEN)}` : ORIGIN + p;
      res = await fetch(fetchUrl, { headers: { 'user-agent': 'enshu-lifehack-snapshot' } });
    } catch (e) {
      console.log('FETCH ERR', p, e.message);
      continue;
    }
    const ct = res.headers.get('content-type') || '';
    if (!res.ok) {
      console.log('SKIP', res.status, p);
      continue;
    }
    if (!ct.includes('text/html')) continue;

    const raw = await res.text();
    const flat = flatten(p);
    const html = processHtml(raw, flat);

    const filePath = join(OUT, flat === '/' ? 'index.html' : flat.replace(/^\//, '') + 'index.html');
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, html, 'utf8');
    savedPaths.push(flat);
    count++;

    // 内部リンク収集（iwata サブツリーのみ）
    for (const href of extractHrefs(raw)) {
      if (!href.startsWith('/')) continue; // 外部/相対/アンカー除外
      const np = normalizePath(href);
      if (!np) continue;
      if (SKIP(np)) continue;
      // iwata 配下のみ追跡（/iwata or /iwata/...）
      if (np === '/iwata/' || np.startsWith('/iwata/')) {
        if (!visited.has(np)) queue.push(np);
      }
    }
  }

  // favicon
  if (existsSync(SRC_FAVICON)) {
    await copyFile(SRC_FAVICON, join(OUT, 'favicon.svg'));
  }

  // sitemap.xml（生成パスから）
  const locs = savedPaths
    .slice()
    .sort()
    .map((p) => `  <url><loc>${NEW_DOMAIN}${p}</loc></url>`)
    .join('\n');
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    locs +
    `\n</urlset>\n`;
  await writeFile(join(OUT, 'sitemap.xml'), sitemap, 'utf8');

  // robots.txt
  await writeFile(
    join(OUT, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${NEW_DOMAIN}/sitemap.xml\n`,
    'utf8'
  );

  // _redirects（旧 /iwata/ 配下を root 直下へ 301）
  await writeFile(
    join(OUT, '_redirects'),
    `# 旧 /iwata/ 配下を新サブドメイン直下へ\n/iwata/  /  301\n/iwata/*  /:splat  301\n`,
    'utf8'
  );

  // 404.html（Cloudflare Pages のカスタム404）
  await writeFile(
    join(OUT, '404.html'),
    `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ページが見つかりません | 磐田ライフハック</title><style>body{margin:0;font-family:-apple-system,"Hiragino Kaku Gothic ProN","Yu Gothic UI",Meiryo,sans-serif;background:#f6f7f5;color:#222;line-height:1.7}.wrap{max-width:760px;margin:0 auto;padding:60px 16px;text-align:center}a{color:#005986;font-weight:700}h1{font-size:22px}</style></head><body><div class="wrap"><h1>ページが見つかりません</h1><p>お探しのページは移動または削除された可能性があります。</p><p><a href="/">磐田ライフハック トップへ</a></p><p style="font-size:12.5px;color:#667;margin-top:24px">本サイトは磐田市公式サイトではありません。最新・正確な情報は磐田市公式サイトをご確認ください。</p></div></body></html>`,
    'utf8'
  );

  console.log('PAGES SAVED:', count);
  console.log('SAMPLE:', savedPaths.slice(0, 20).join('  '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
