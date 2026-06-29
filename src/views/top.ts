// ============================================================
// トップページ本文（本日の更新 + A+カテゴリ + 全カテゴリ）
// ============================================================

import type { Category, DailyChange, Municipality } from '../types';
import { esc, fmtDate } from '../util';
import { priorityBadge } from './layout';

const CHANGE_LABEL: Record<string, string> = {
  added: '新規',
  updated: '更新',
  title_changed: '改題',
  category_changed: '分類変更',
};

export function topBody(
  muni: Municipality,
  categories: Category[],
  counts: Record<string, number>,
  changes: DailyChange[],
  changesAreToday: boolean,
): string {
  const base = `/${muni.slug}`;

  // 本日の更新
  const updates =
    changes.length > 0
      ? changes
          .map(
            (c) => `<div class="update-item">
        <span class="ct ct-${esc(c.change_type)}">${esc(CHANGE_LABEL[c.change_type] || c.change_type)}</span>
        ${priorityBadge(c.priority_snapshot)}
        <a href="${esc(c.official_url_snapshot || '#')}" rel="noopener">${esc(c.title_snapshot || '(無題)')}</a> ↗
        <span class="meta"> ${esc(fmtDate(c.detected_at))}</span>
      </div>`,
          )
          .join('')
      : '<div class="empty">本日の新着・更新はまだありません。</div>';

  // A+カテゴリ（コアカテゴリ）まとめ
  const core = categories.filter((c) => c.is_core === 1);
  const coreTiles = core
    .map(
      (c) => `<a class="tile" href="${base}/category/${esc(c.id)}/">
      <div><b>${esc(c.name)}</b> ${priorityBadge(c.priority)}</div>
      <div class="n">${counts[c.id] ?? 0} 件のページ</div>
    </a>`,
    )
    .join('');

  // 全カテゴリ
  const allTiles = categories
    .map(
      (c) => `<a class="tile" href="${base}/category/${esc(c.id)}/">
      <div><b>${esc(c.name)}</b></div>
      <div class="n">${counts[c.id] ?? 0} 件</div>
    </a>`,
    )
    .join('');

  return `
  <h1 class="page">${esc(muni.name)}の暮らしの情報を、たどりやすく</h1>
  <p class="muted">${esc(muni.name)}公式サイトの情報を整理・分類し、必要な情報へ素早くご案内します。${changesAreToday ? '' : '（直近の更新を表示しています）'}</p>

  <h2 class="sec">本日の更新</h2>
  ${updates}

  <h2 class="sec">重要カテゴリ（A+）</h2>
  <div class="grid">${coreTiles}</div>

  <h2 class="sec">すべてのカテゴリ</h2>
  <div class="grid">${allTiles}</div>

  <div class="care-cta">
    <b>介護・福祉のご相談</b><br>
    ${esc(muni.name)}での介護施設さがし・高齢者支援・地域包括支援センターのことなど、お困りごとは
    運営の<b>富士ヶ丘サービス</b>へお気軽にご相談ください。
  </div>
  `;
}
