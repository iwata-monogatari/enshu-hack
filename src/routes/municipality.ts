// ============================================================
// 自治体トップページ ルート
// ============================================================

import type { Env, Municipality } from '../types';
import {
  getCategories,
  getCategoryCounts,
  getChangesSince,
  getRecentChanges,
} from '../db/queries';
import { htmlResponse, layout } from '../views/layout';
import { topBody } from '../views/top';

export async function renderMunicipalityTop(env: Env, muni: Municipality): Promise<Response> {
  const categories = await getCategories(env.DB);
  const counts = await getCategoryCounts(env.DB, muni.id);

  // 本日の差分（直近24時間）。無ければ直近の更新へフォールバック。
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  let changes = await getChangesSince(env.DB, [muni.id], since);
  let changesAreToday = true;
  if (changes.length === 0) {
    changes = await getRecentChanges(env.DB, [muni.id], 15);
    changesAreToday = false;
  }

  const body = topBody(muni, categories, counts, changes, changesAreToday);
  return htmlResponse(
    layout({
      muni,
      title: `${muni.short_name}ハック`,
      body,
      categoriesNav: categories.map((c) => ({ id: c.id, name: c.name })),
    }),
  );
}
