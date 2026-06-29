// ============================================================
// 困りごと ルート（新生活ナビトップ / 旧URLリダイレクト / 検索ナビ）
// ============================================================

import type { Env, Municipality } from '../types';
import {
  getLifeCategories,
  getLifeTopicsByCategory,
  getLifeTopicBySlug,
  getTroubleGuideByTopic,
  getProcedureSteps,
  getChangesSince,
  getRecentChanges,
} from '../db/queries';
import { htmlResponse, layout } from '../views/layout';
import { troubleTopBody } from '../views/troubleTop';
import { esc } from '../util';

// 旧困りごとスラッグから新生活トピックURLへのリダイレクトマッピング
const OLD_SLUG_MAP: Record<string, { cat: string; topic: string }> = {
  death: { cat: 'end-of-life', topic: 'bereavement' },
  moving_in: { cat: 'start-living', topic: 'moved-in' },
  moving_out: { cat: 'moving-out', topic: 'moving-away' },
  birth: { cat: 'family-grow', topic: 'childbirth' },
  elderly_care: { cat: 'parents-care', topic: 'care-started' },
  garbage: { cat: 'start-living', topic: 'how-to-garbage' },
  disaster: { cat: 'emergency', topic: 'storm-heavy-rain' },
  tax_notice: { cat: 'work-life', topic: 'tax' },
  facility_booking: { cat: 'play-out', topic: 'rent-public-facilities' },
  vacant_house: { cat: 'housing', topic: 'vacant-house' },
};

/** スマホファースト トップ（新生活OSが主役） */
export async function renderTroubleTop(env: Env, muni: Municipality, notice?: string, url?: URL): Promise<Response> {
  const [categories, topics] = await Promise.all([
    getLifeCategories(env.DB, muni.id),
    // 全中項目を取得
    env.DB.prepare("SELECT * FROM life_topics WHERE municipality_id = ? AND status = 'published' ORDER BY display_order").bind(muni.id).all<any>().then(r => r.results ?? [])
  ]);

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  let changes = await getChangesSince(env.DB, [muni.id], since);
  let changesAreToday = true;
  if (changes.length === 0) {
    changes = await getRecentChanges(env.DB, [muni.id], 15);
    changesAreToday = false;
  }

  // emergency_mode 判定: URLパラメータ ?emergency=1 もしくは環境変数/Vars
  const isEmergency = url?.searchParams.get('emergency') === '1' || (env as any).EMERGENCY_MODE === 'true';

  const noticeHtml = notice ? `<div class="first-action">${esc(notice)}</div>` : '';
  const body = noticeHtml + troubleTopBody(muni, categories, topics, changes, changesAreToday, isEmergency);
  
  const categoriesNav = categories.map((c) => ({ id: c.id, name: c.title }));

  return htmlResponse(
    layout({
      muni,
      title: `${muni.short_name}ライフハック｜市民のどうしようを解決する生活ナビゲーション`,
      body,
      categoriesNav,
    }),
  );
}

/** 旧困りごとページのハンドリング：新URLへ302リダイレクト、またはフォールバック表示 */
export async function renderTroubleGuide(env: Env, muni: Municipality, slug: string): Promise<Response> {
  const mapping = OLD_SLUG_MAP[slug];
  if (mapping) {
    return new Response(null, {
      status: 302,
      headers: { location: `/${muni.slug}/life/${mapping.cat}/${mapping.topic}/` },
    });
  }

  // マッピングがない場合はトップへリダイレクト
  return new Response(null, {
    status: 302,
    headers: { location: `/${muni.slug}/` },
  });
}

/** 検索ナビ：簡易一致で新生活トピックへ誘導 */
export async function handleNavigate(env: Env, muni: Municipality, q: string): Promise<Response> {
  // 簡易検索: life_topics から部分一致で最初に見つかったトピックに誘導
  const query = q.trim();
  if (query) {
    const topic = await env.DB.prepare(
      `SELECT t.*, c.slug as cat_slug FROM life_topics t
       JOIN life_categories c ON c.id = t.category_id
       WHERE t.municipality_id = ? AND (t.title LIKE ? OR t.summary LIKE ?) LIMIT 1`
    ).bind(muni.id, `%${query}%`, `%${query}%`).first<any>();

    if (topic) {
      return new Response(null, {
        status: 302,
        headers: { location: `/${muni.slug}/life/${topic.cat_slug}/${topic.slug}/` },
      });
    }
  }

  const notice = q
    ? `「${q}」に近い手続きが見つかりませんでした。下の一覧から探してください。`
    : '';
  
  // URLは持たずにダミーのオブジェクトで renderTroubleTop を叩く
  return await renderTroubleTop(env, muni, notice);
}
