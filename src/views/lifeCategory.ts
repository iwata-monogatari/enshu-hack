// ============================================================
// 大項目（生活カテゴリ）ページ本文
// 属する中項目を一覧で表示し、ナビゲーションをサポートします。
// ============================================================

import type { Municipality, LifeCategoryRow, LifeTopicRow } from '../types';
import { esc } from '../util';

export function lifeCategoryBody(
  muni: Municipality,
  category: LifeCategoryRow,
  topics: LifeTopicRow[],
): string {
  const base = `/${muni.slug}`;

  const topicListHtml = topics.map(t => `
    <a class="sit-card" href="${base}/life/${category.slug}/${t.slug}/" style="display:flex; align-items:center; gap:12px; min-height:60px; background:#fff; border:1.5px solid var(--line); border-radius:14px; padding:14px 16px; font-size:17.5px; font-weight:700; color:var(--ink); margin-bottom:10px;">
      <span class="ic" style="font-size:22px;">${esc(t.icon || '📝')}</span>
      <span>${esc(t.title)}</span>
      <span class="arw" style="margin-left:auto; color:var(--green); font-weight:800; font-size:20px;">›</span>
    </a>
  `).join('');

  // 相談導線の表示判定 (家・住まい housing, 親のこと parents-care, 人生の終わり end-of-life)
  const isConsultCategory = category.slug === 'housing' || category.slug === 'parents-care' || category.slug === 'end-of-life';
  const consultCtaHtml = isConsultCategory
    ? `<div class="care-cta" style="margin-top: 24px; border: 1.5px solid var(--green); background:#f0f7f3; border-radius:14px; padding:16px;">
        <b style="color:var(--green-d); font-size:16px;">🏠 介護・住まいのご相談</b><br>
        <p style="margin:6px 0 0 0; font-size:14.5px; line-height:1.6;">
          磐田市での介護施設さがし、高齢者支援、地域包括支援センターのこと、また実家・空き家・相続した家の整理については、運営の<b>富士ヶ丘サービス</b>へお気軽にご相談ください。
        </p>
       </div>`
    : '';

  return `
    <p class="muted" style="font-size:13px; margin-bottom:8px;">
      <a href="${base}/">${esc(muni.short_name)}ライフハック</a> ／ 
      <span>${esc(category.title)}</span>
    </p>

    <div style="margin-bottom: 24px;">
      <h1 class="page" style="font-size:24px; font-weight:800; color:var(--green-d); display:flex; align-items:center; gap:8px;">
        <span class="ic">${esc(category.icon || '🌱')}</span>
        <span>${esc(category.title)}</span>
      </h1>
      ${category.subtitle ? `<p class="lead" style="font-size:15px; margin-top:8px; color:var(--mut);">${esc(category.subtitle)}</p>` : ''}
    </div>

    <h2 class="sec">手続き・困りごと一覧</h2>
    <div class="sit-list" style="margin-bottom: 24px;">
      ${topicListHtml || '<div class="empty">現在、掲載中の手続きはありません。</div>'}
    </div>

    ${consultCtaHtml}

    <div class="ai-consult-cta" style="background:#f6f7f5; border:1px dashed var(--line); border-radius:14px; padding:18px; margin-top:32px; text-align:center;">
      <h4 style="margin:0 0 8px 0; font-size:15px; color:var(--ink);">🔍 まだ見つかりませんか？</h4>
      <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
        <a class="print-btn" href="${base}/navigate?q=AI相談" style="cursor:pointer; background:#fff;">🤖 AIに相談する</a>
        <a class="print-btn" href="${base}/" style="cursor:pointer; background:#fff;">📋 キーワードから探す</a>
      </div>
    </div>
  `;
}
