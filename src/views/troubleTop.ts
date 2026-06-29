// ============================================================
// スマホファースト トップページ本文
// 主役はカテゴリではなく「今、どうしましたか？」（困りごと）。
// 構成（指示書4.2）: 説明→困りごとカード→緊急カード→本日の更新→カテゴリ→公式→運営
// ============================================================

import type { Category, DailyChange, Municipality, TroubleGuideRow } from '../types';
import { esc } from '../util';

const CHANGE_LABEL: Record<string, string> = {
  added: '新規',
  updated: '更新',
  title_changed: '改題',
  category_changed: '分類変更',
};

export function troubleTopBody(
  muni: Municipality,
  guides: TroubleGuideRow[],
  categories: Category[],
  counts: Record<string, number>,
  changes: DailyChange[],
  changesAreToday: boolean,
): string {
  const base = `/${muni.slug}`;

  // 4. 困りごとカード
  const sitCards = guides
    .map(
      (g) => `<a class="sit-card" href="${base}/trouble/${esc(g.slug)}/">
        <span>${esc(g.situation_label || g.title)}</span>
        <span class="arw">›</span>
      </a>`,
    )
    .join('');

  // 5. 緊急・重要カード（防災・夜間休日医療・ごみ・介護）
  const urgent = `<div class="urgent-grid">
    <a class="u-card u-bousai" href="${base}/trouble/disaster/">防災<span class="s">台風・大雨・避難</span></a>
    <a class="u-card u-iryo" href="${base}/category/fukushi/">夜間・休日医療<span class="s">急な体調不良</span></a>
    <a class="u-card u-gomi" href="${base}/trouble/garbage/">ごみ<span class="s">収集日・分別</span></a>
    <a class="u-card u-care" href="${base}/trouble/elderly_care/">介護<span class="s">はじめての相談</span></a>
  </div>`;

  // 6. 本日の更新
  const updates =
    changes.length > 0
      ? changes
          .slice(0, 8)
          .map(
            (c) => `<div class="update-item">
              <span class="ct ct-${esc(c.change_type)}">${esc(CHANGE_LABEL[c.change_type] || c.change_type)}</span>
              <a href="${esc(c.official_url_snapshot || '#')}" rel="noopener">${esc(c.title_snapshot || '(無題)')}</a> ↗
            </div>`,
          )
          .join('')
      : '<div class="empty">本日の新着・更新はまだありません。</div>';

  // 7. カテゴリ一覧（控えめ）
  const catTiles = categories
    .map(
      (c) => `<a class="tile" href="${base}/category/${esc(c.id)}/"><b>${esc(c.name)}</b><div class="n">${counts[c.id] ?? 0} 件</div></a>`,
    )
    .join('');

  return `
  <p class="lead">困ったとき、まず何をすればよいかを案内する${esc(muni.name)}の生活ナビです。${esc(muni.name)}公式サイトをもとに整理した非公式サイトです。</p>

  <form class="searchbox" action="${base}/navigate" method="get" role="search">
    <input name="q" type="search" placeholder="例：親が亡くなった／引っ越し／ごみ" aria-label="困りごとを入力">
    <button type="submit">探す</button>
  </form>

  <h2 class="askbig">今、どうしましたか？</h2>
  <div class="sit-list">${sitCards}</div>

  <h2 class="sec">急ぎ・よく使う</h2>
  ${urgent}

  <h2 class="sec">本日の更新${changesAreToday ? '' : '（直近）'}</h2>
  ${updates}

  <h2 class="sec">カテゴリから探す</h2>
  <div class="grid">${catTiles}</div>

  <div class="care-cta">
    <b>介護・福祉のご相談</b><br>
    ${esc(muni.name)}での介護施設さがし・高齢者支援・地域包括支援センターのことは、運営の<b>富士ヶ丘サービス</b>へお気軽にご相談ください。
  </div>
  `;
}
