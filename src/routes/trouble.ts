// ============================================================
// 困りごと ルート（スマホファースト トップ / 困りごとページ / 検索ナビ）
// ============================================================

import type { Env, Municipality } from '../types';
import {
  getCategories,
  getCategoryCounts,
  getChangesSince,
  getRecentChanges,
  getTroubleGuide,
  getTroubleGuides,
  getProcedureSteps,
} from '../db/queries';
import { htmlResponse, layout } from '../views/layout';
import { troubleTopBody } from '../views/troubleTop';
import { troubleGuideBody } from '../views/troubleGuide';
import { EVENT_META, matchEvent } from '../data/troubleMeta';
import { esc } from '../util';

/** スマホファースト トップ（困りごとが主役） */
export async function renderTroubleTop(env: Env, muni: Municipality, notice?: string): Promise<Response> {
  const [guides, categories, counts] = await Promise.all([
    getTroubleGuides(env.DB, muni.id),
    getCategories(env.DB),
    getCategoryCounts(env.DB, muni.id),
  ]);

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  let changes = await getChangesSince(env.DB, [muni.id], since);
  let changesAreToday = true;
  if (changes.length === 0) {
    changes = await getRecentChanges(env.DB, [muni.id], 8);
    changesAreToday = false;
  }

  const noticeHtml = notice ? `<div class="first-action">${esc(notice)}</div>` : '';
  const body = noticeHtml + troubleTopBody(muni, guides, categories, counts, changes, changesAreToday);
  return htmlResponse(
    layout({
      muni,
      title: `${muni.short_name}ハック｜くらしの困りごとナビ`,
      body,
      categoriesNav: categories.map((c) => ({ id: c.id, name: c.name })),
    }),
  );
}

/** 困りごとページ */
export async function renderTroubleGuide(env: Env, muni: Municipality, slug: string): Promise<Response> {
  const guide = await getTroubleGuide(env.DB, muni.id, slug);
  const categories = await getCategories(env.DB);
  const nav = categories.map((c) => ({ id: c.id, name: c.name }));
  if (!guide || guide.status !== 'published') {
    return htmlResponse(
      layout({
        muni,
        title: '困りごとが見つかりません',
        body: `<h1 class="page">ページが見つかりません</h1><p class="muted"><a href="/${esc(muni.slug)}/">トップから困りごとを選ぶ</a></p>`,
        categoriesNav: nav,
      }),
      404,
    );
  }
  const steps = await getProcedureSteps(env.DB, guide.id);
  const meta = EVENT_META[guide.slug];
  return htmlResponse(
    layout({
      muni,
      title: guide.title,
      body: troubleGuideBody(muni, guide, steps, meta),
      categoriesNav: nav,
    }),
  );
}

/** 検索ナビ：検索語のゆらぎ → 出来事ID（LLM不使用）。一致で困りごとへ誘導。 */
export async function handleNavigate(env: Env, muni: Municipality, q: string): Promise<Response> {
  const event = matchEvent(q);
  if (event) {
    const guide = await getTroubleGuide(env.DB, muni.id, event);
    if (guide) {
      return new Response(null, { status: 302, headers: { location: `/${muni.slug}/trouble/${event}/` } });
    }
  }
  const notice = q
    ? `「${q}」に近い困りごとが見つかりませんでした。下の一覧から選んでください。`
    : '';
  return await renderTroubleTop(env, muni, notice);
}
