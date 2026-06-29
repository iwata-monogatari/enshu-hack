// ============================================================
// 生活ナビゲーション ルート (大項目ページ / 中項目ページ)
// ============================================================

import type { Env, Municipality } from '../types';
import {
  getLifeCategories,
  getLifeTopicsByCategory,
  getLifeTopicBySlug,
  getTroubleGuideByTopic,
  getProcedureSteps,
} from '../db/queries';
import { htmlResponse, layout } from '../views/layout';
import { lifeCategoryBody } from '../views/lifeCategory';
import { lifeTopicBody } from '../views/lifeTopic';
import { esc } from '../util';

/** 大項目（生活カテゴリ）ページ */
export async function renderLifeCategory(
  env: Env,
  muni: Municipality,
  categorySlug: string
): Promise<Response> {
  const categories = await getLifeCategories(env.DB, muni.id);
  const currentCategory = categories.find((c) => c.slug === categorySlug);

  const categoriesNav = categories.map((c) => ({ id: c.id, name: c.title }));

  if (!currentCategory) {
    return htmlResponse(
      layout({
        muni,
        title: 'カテゴリが見つかりません',
        body: `<h1 class="page">ページが見つかりません</h1><p class="muted"><a href="/${esc(muni.slug)}/">トップから探す</a></p>`,
        categoriesNav,
      }),
      404
    );
  }

  const topics = await getLifeTopicsByCategory(env.DB, muni.id, currentCategory.id);
  const body = lifeCategoryBody(muni, currentCategory, topics);

  return htmlResponse(
    layout({
      muni,
      title: `${currentCategory.title} | ${muni.short_name}ライフハック`,
      body,
      categoriesNav,
    })
  );
}

/** 中項目（生活トピック）詳細ページ */
export async function renderLifeTopic(
  env: Env,
  muni: Municipality,
  categorySlug: string,
  topicSlug: string
): Promise<Response> {
  const categories = await getLifeCategories(env.DB, muni.id);
  const categoriesNav = categories.map((c) => ({ id: c.id, name: c.title }));

  const topic = await getLifeTopicBySlug(env.DB, muni.id, topicSlug);
  if (!topic) {
    return htmlResponse(
      layout({
        muni,
        title: 'トピックが見つかりません',
        body: `<h1 class="page">ページが見つかりません</h1><p class="muted"><a href="/${esc(muni.slug)}/">トップから探す</a></p>`,
        categoriesNav,
      }),
      404
    );
  }

  const guide = await getTroubleGuideByTopic(env.DB, muni.id, topic.id);
  if (!guide) {
    return htmlResponse(
      layout({
        muni,
        title: '詳細情報が見つかりません',
        body: `<h1 class="page">詳細データがありません</h1><p class="muted"><a href="/${esc(muni.slug)}/">トップから探す</a></p>`,
        categoriesNav,
      }),
      404
    );
  }

  const steps = await getProcedureSteps(env.DB, guide.id);
  const body = lifeTopicBody(muni, categorySlug, topicSlug, guide, steps);

  return htmlResponse(
    layout({
      muni,
      title: `${guide.title} | ${muni.short_name}ライフハック`,
      body,
      categoriesNav,
    })
  );
}
