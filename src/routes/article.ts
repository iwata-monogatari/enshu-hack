// ============================================================
// 記事ページ ルート
// ============================================================

import type { Env, Municipality, OfficialPage } from '../types';
import { getArticleBySlug, getCategories, getPageById } from '../db/queries';
import { htmlResponse, layout } from '../views/layout';
import { articleBody } from '../views/article';

export async function renderArticle(
  env: Env,
  muni: Municipality,
  slug: string,
): Promise<Response> {
  const categories = await getCategories(env.DB);
  const nav = categories.map((c) => ({ id: c.id, name: c.name }));

  const article = (await getArticleBySlug(env.DB, muni.id, slug)) as
    | {
        official_page_id: string;
        title: string;
        summary: string | null;
        body: string | null;
        status: string | null;
        generated_level: string | null;
      }
    | null;

  if (!article) {
    return htmlResponse(
      layout({
        muni,
        title: '記事が見つかりません',
        body: '<h1 class="page">記事が見つかりません</h1>',
        categoriesNav: nav,
      }),
      404,
    );
  }

  const page = (await getPageById(env.DB, article.official_page_id)) as OfficialPage | null;
  if (!page) {
    return htmlResponse(
      layout({ muni, title: article.title, body: '<p>元の公式ページ情報が見つかりません。</p>', categoriesNav: nav }),
      404,
    );
  }

  return htmlResponse(
    layout({ muni, title: article.title, body: articleBody(muni, article, page), categoriesNav: nav }),
  );
}
