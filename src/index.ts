import type { Env, FeedbackType } from './types';
import { getMunicipalityBySlug, insertFeedback, seedTroubleGuides } from './db/queries';
import { renderCategory } from './routes/category';
import { renderArticle } from './routes/article';
import { renderEnshuTop, renderEnshuCategory } from './routes/enshu';
import { renderTroubleTop, renderTroubleGuide, handleNavigate } from './routes/trouble';
import { renderLifeCategory, renderLifeTopic } from './routes/life';
import { crawlActive, crawlBySlug } from './crawler/runCrawl';
import { htmlResponse } from './views/layout';

export default {
  async fetch(req: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const seg = path.split('/').filter(Boolean); // [] for '/'

    try {
      // ── 新ドメイン移行（2026-06）：公開アクセスは iwata.enshu-lifehack.com へ 301 ──
      // ただし再生成(snapshot)・管理(admin)用に CRAWL_TOKEN 付きアクセスは素通りさせ、
      // 従来の動的レンダリングを維持する（cron クローラーは scheduled() 側で別途継続）。
      {
        const token = url.searchParams.get('token');
        const bypass = !!env.CRAWL_TOKEN && token === env.CRAWL_TOKEN;
        if (!bypass) {
          const dest = new URL('https://iwata.enshu-lifehack.com');
          // /iwata 配下はサブドメイン直下へ平坦化、それ以外はそのまま
          dest.pathname =
            url.pathname === '/iwata' || url.pathname.startsWith('/iwata/')
              ? url.pathname.replace(/^\/iwata/, '') || '/'
              : url.pathname || '/';
          dest.search = url.search;
          return Response.redirect(dest.toString(), 301);
        }
      }

      // 静的アセット（robots.txt / favicon 等）は ASSETS へ委譲
      if (path === '/robots.txt' || path === '/favicon.svg' || path === '/favicon.ico') {
        return env.ASSETS.fetch(req);
      }

      // 管理: 手動クロール実行  /admin/crawl?token=...&muni=iwata
      if (path === '/admin/crawl') {
        return await handleAdminCrawl(req, env, url);
      }

      // 管理: 困りごとデータ投入  /admin/seed-guides?token=...&muni=iwata
      if (path === '/admin/seed-guides') {
        return await handleSeedGuides(env, url);
      }

      // フィードバック API（個人情報なし）  POST /api/feedback
      if (path === '/api/feedback') {
        return await handleFeedback(req, env);
      }

      // 動的サイトマップ
      if (path === '/sitemap.xml') {
        return await renderSitemapXml(env, url);
      }

      // ルート "/" → 既定自治体トップ（困りごとが主役）
      if (seg.length === 0) {
        const muni = await getMunicipalityBySlug(env.DB, env.DEFAULT_MUNICIPALITY || 'iwata');
        if (!muni) return text('既定の自治体が見つかりません。seed を投入してください。', 500);
        return await renderTroubleTop(env, muni, undefined, url);
      }

      // 遠州ハック  /enshu , /enshu/:categoryId
      if (seg[0] === 'enshu') {
        if (seg.length === 1) return await renderEnshuTop(env);
        return await renderEnshuCategory(env, seg[1]);
      }

      // 自治体配下
      const muni = await getMunicipalityBySlug(env.DB, seg[0]);
      if (!muni) return notFound();

      if (seg.length === 1) return await renderTroubleTop(env, muni, undefined, url); // 困りごとトップ
      if (seg[1] === 'trouble' && seg[2]) return await renderTroubleGuide(env, muni, seg[2]);
      if (seg[1] === 'navigate') return await handleNavigate(env, muni, url.searchParams.get('q') || '');
      if (seg[1] === 'life') {
        if (seg.length === 2) return await renderTroubleTop(env, muni, undefined, url);
        if (seg.length === 3) return await renderLifeCategory(env, muni, seg[2]);
        if (seg.length === 4) return await renderLifeTopic(env, muni, seg[2], seg[3]);
      }
      if (seg[1] === 'category' && seg[2]) return await renderCategory(env, muni, seg[2]);
      if (seg[1] === 'article' && seg[2]) return await renderArticle(env, muni, seg[2]);

      return notFound();
    } catch (e: any) {
      return text(`内部エラー: ${e?.message || String(e)}`, 500);
    }
  },

  // 日次クロール
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      (async () => {
        const reports = await crawlActive(env);
        for (const r of reports) {
          console.log(`[crawl] ${r.municipalityId}`, JSON.stringify(r));
        }
      })(),
    );
  },
};

// ---- 管理: 手動クロール ----
async function handleAdminCrawl(req: Request, env: Env, url: URL): Promise<Response> {
  const token = url.searchParams.get('token');
  if (!env.CRAWL_TOKEN || token !== env.CRAWL_TOKEN) {
    return text('unauthorized', 401);
  }
  const muniSlug = url.searchParams.get('muni');
  const reports = muniSlug
    ? [await crawlBySlug(env, muniSlug)].filter(Boolean)
    : await crawlActive(env);
  return new Response(JSON.stringify(reports, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

// ---- 管理: 困りごとデータ投入（冪等・トークン必須） ----
async function handleSeedGuides(env: Env, url: URL): Promise<Response> {
  const token = url.searchParams.get('token');
  if (!env.CRAWL_TOKEN || token !== env.CRAWL_TOKEN) return text('unauthorized', 401);
  const muniSlug = url.searchParams.get('muni') || env.DEFAULT_MUNICIPALITY || 'iwata';
  const muni = await getMunicipalityBySlug(env.DB, muniSlug);
  if (!muni) return text('municipality not found', 404);
  const result = await seedTroubleGuides(env.DB, muni.id);
  return new Response(JSON.stringify({ municipality: muni.id, ...result }, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

// ---- フィードバック（POST JSON, 個人情報なし） ----
const VALID_FEEDBACK: FeedbackType[] = ['solved', 'still_worried', 'could_not_find', 'wrong_page'];
async function handleFeedback(req: Request, env: Env): Promise<Response> {
  if (req.method !== 'POST') return text('method not allowed', 405);
  let body: any;
  try {
    body = await req.json();
  } catch {
    return text('bad request', 400);
  }
  const type = body?.type as FeedbackType;
  if (!VALID_FEEDBACK.includes(type)) return text('invalid feedback type', 400);
  const muniId = typeof body?.muni === 'string' ? body.muni : env.DEFAULT_MUNICIPALITY || 'iwata';
  const guideId = typeof body?.guide === 'string' ? body.guide : null;
  // freeword は任意・短く制限（個人情報を促さない）
  const freeword = typeof body?.freeword === 'string' ? body.freeword.slice(0, 200) : null;
  await insertFeedback(env.DB, muniId, guideId, type, freeword);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

// ---- 動的 sitemap.xml（有効自治体トップ + 遠州） ----
async function renderSitemapXml(env: Env, url: URL): Promise<Response> {
  const origin = `${url.protocol}//${url.host}`;
  const r = await env.DB.prepare('SELECT id, slug FROM municipalities WHERE is_active = 1').all<{ id: string; slug: string }>();
  const locs = [`${origin}/`, `${origin}/enshu/`];
  for (const m of r.results ?? []) {
    locs.push(`${origin}/${m.slug}/`);
    
    // 大項目
    const cats = await env.DB
      .prepare('SELECT id, slug FROM life_categories WHERE municipality_id = ? ORDER BY display_order')
      .bind(m.id)
      .all<{ id: string; slug: string }>();
    
    for (const c of cats.results ?? []) {
      locs.push(`${origin}/${m.slug}/life/${c.slug}/`);
      
      // 中項目
      const tops = await env.DB
        .prepare('SELECT slug FROM life_topics WHERE municipality_id = ? AND category_id = ? AND status = \'published\' ORDER BY display_order')
        .bind(m.id, c.id)
        .all<{ slug: string }>();
      for (const t of tops.results ?? []) {
        locs.push(`${origin}/${m.slug}/life/${c.slug}/${t.slug}/`);
      }
    }
  }
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    locs.map((l) => `  <url><loc>${l}</loc></url>`).join('\n') +
    `\n</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}

function notFound(): Response {
  return htmlResponse(
    '<!doctype html><meta charset="utf-8"><title>404</title><div style="font-family:sans-serif;padding:40px"><h1>404 Not Found</h1><p><a href="/">トップへ</a></p></div>',
    404,
  );
}

function text(s: string, status = 200): Response {
  return new Response(s, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
