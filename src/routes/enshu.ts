// ============================================================
// 遠州ハック ルート（統合トップ + カテゴリ別統合）
// ============================================================

import type { Env, Municipality } from '../types';
import {
  getActiveMunicipalities,
  getCategories,
  getCategory,
  getEnshuIndex,
  getRecentChanges,
} from '../db/queries';
import { htmlResponse, layout } from '../views/layout';
import { enshuCategoryBody, enshuTopBody } from '../views/enshu';

/** layout に渡す擬似 muni（遠州ハック用） */
function enshuMuni(): Municipality {
  return {
    id: 'enshu',
    name: '遠州エリア',
    short_name: '遠州',
    slug: 'enshu',
    official_base_url: '',
    sitemap_url: null,
    region: '遠州',
    is_active: 1,
    display_order: 0,
  };
}

export async function renderEnshuTop(env: Env): Promise<Response> {
  const munis = await getActiveMunicipalities(env.DB);
  const categories = await getCategories(env.DB);
  const recent = await getRecentChanges(env.DB, munis.map((m) => m.id), 15);
  const muniShortById: Record<string, string> = {};
  for (const m of munis) muniShortById[m.id] = m.short_name;

  const body = enshuTopBody(munis, categories, recent, muniShortById);
  return htmlResponse(
    layout({
      muni: enshuMuni(),
      title: '遠州ハック',
      body,
      categoriesNav: categories.map((c) => ({ id: c.id, name: c.name })),
      isEnshu: true,
    }),
  );
}

export async function renderEnshuCategory(env: Env, categoryId: string): Promise<Response> {
  const category = await getCategory(env.DB, categoryId);
  const categories = await getCategories(env.DB);
  const nav = categories.map((c) => ({ id: c.id, name: c.name }));
  if (!category) {
    return htmlResponse(
      layout({ muni: enshuMuni(), title: '遠州ハック', body: '<h1 class="page">カテゴリが見つかりません</h1>', categoriesNav: nav, isEnshu: true }),
      404,
    );
  }
  const rows = (await getEnshuIndex(env.DB, categoryId)) as any[];
  return htmlResponse(
    layout({
      muni: enshuMuni(),
      title: `遠州の${category.name}`,
      body: enshuCategoryBody(category, rows),
      categoriesNav: nav,
      isEnshu: true,
    }),
  );
}
