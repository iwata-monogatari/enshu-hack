// ============================================================
// カテゴリページ ルート
// ============================================================

import type { Env, Municipality } from '../types';
import { getCategories, getCategory, getPublicPagesByCategory } from '../db/queries';
import { htmlResponse, layout } from '../views/layout';
import { categoryBody } from '../views/category';

export async function renderCategory(
  env: Env,
  muni: Municipality,
  categoryId: string,
): Promise<Response> {
  const category = await getCategory(env.DB, categoryId);
  if (!category) return notFound(env, muni);

  const pages = await getPublicPagesByCategory(env.DB, muni.id, categoryId);

  // 記事枠の slug を引く（A+/A/B のリンク先）
  const ids = pages.map((p) => p.id);
  const articleSlugByPageId: Record<string, string> = {};
  if (ids.length > 0) {
    const ph = ids.map(() => '?').join(',');
    const r = await env.DB.prepare(
      `SELECT official_page_id, slug FROM hack_articles WHERE official_page_id IN (${ph})`,
    )
      .bind(...ids)
      .all<{ official_page_id: string; slug: string }>();
    for (const row of r.results ?? []) articleSlugByPageId[row.official_page_id] = row.slug;
  }

  const categories = await getCategories(env.DB);
  const body = categoryBody(muni, category, pages, articleSlugByPageId);
  return htmlResponse(
    layout({
      muni,
      title: category.name,
      body,
      categoriesNav: categories.map((c) => ({ id: c.id, name: c.name })),
    }),
  );
}

async function notFound(env: Env, muni: Municipality): Promise<Response> {
  const categories = await getCategories(env.DB);
  return htmlResponse(
    layout({
      muni,
      title: 'ページが見つかりません',
      body: '<h1 class="page">ページが見つかりません</h1><p class="muted">カテゴリが存在しないか、まだ取得されていません。</p>',
      categoriesNav: categories.map((c) => ({ id: c.id, name: c.name })),
    }),
    404,
  );
}
