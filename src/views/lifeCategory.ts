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
    ? `
      <div class="consult-section" style="margin-top: 32px; border-top: 2px solid var(--line); padding-top: 24px;">
        <h3 style="font-size: 19px; font-weight: 800; color: var(--green-d); margin: 0 0 16px 0; text-align: center;">
          💡 こんなことも相談できます
        </h3>
        <div class="consult-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 24px;">
          
          <!-- カード 1: 住まい -->
          <div class="consult-card" style="background:#fff; border: 1.5px solid var(--line); border-radius:14px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            <div>
              <h4 style="margin:0 0 10px 0; font-size:16px; font-weight:800; color:var(--green-d); display:flex; align-items:center; gap:6px;">
                <span>🏠</span> <span>家・土地・空き家のこと</span>
              </h4>
              <p style="margin:0 0 12px 0; font-size:13.5px; line-height:1.5; color:var(--ink);">
                相続した実家、空き家、住宅購入、住み替え、売却など、住まいに関するご相談はこちら。
              </p>
              <div style="border-top:1px dashed var(--line); padding-top:8px; margin-top:8px; font-size:13px; color:var(--mut); line-height:1.6;">
                <b style="color:var(--ink); font-size:13.5px;">富士ヶ丘サービス 不動産部</b><br>
                TEL：0538-31-3308<br>
                <a href="https://www.fujigaoka-service.co.jp/" target="_blank" rel="noopener" style="color:var(--green-d); font-weight:700; text-decoration:underline;">ホームページ ↗</a><br>
                <a href="https://line.me/R/ti/p/%40487nnyec" target="_blank" rel="noopener" style="color:#06c755; font-weight:700; text-decoration:underline;">LINE公式アカウント ↗</a>
              </div>
            </div>
            <div style="margin-top:16px;">
              <a href="https://www.fujigaoka-service.co.jp/" target="_blank" rel="noopener" class="print-btn" style="display:flex; justify-content:center; text-align:center; background:var(--green); color:#fff; border:none; border-radius:8px; padding:10px; font-size:14px; font-weight:700; cursor:pointer; text-decoration:none; width:100%;">
                住まいについて相談する
              </a>
            </div>
          </div>

          <!-- カード 2: 介護 -->
          <div class="consult-card" style="background:#fff; border: 1.5px solid var(--line); border-radius:14px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            <div>
              <h4 style="margin:0 0 10px 0; font-size:16px; font-weight:800; color:var(--green-d); display:flex; align-items:center; gap:6px;">
                <span>❤️</span> <span>介護・高齢者のこと</span>
              </h4>
              <p style="margin:0 0 12px 0; font-size:13.5px; line-height:1.5; color:var(--ink);">
                介護保険、ケアマネジャー、介護施設探し、地域包括支援センターとの連携など、高齢者やご家族の介護に関するご相談はこちら。
              </p>
              <div style="border-top:1px dashed var(--line); padding-top:8px; margin-top:8px; font-size:12.5px; color:var(--mut); line-height:1.6;">
                <b style="color:var(--ink); font-size:13.5px;">富士ヶ丘サービス 介護部門</b><br>
                <span style="font-weight:700; color:var(--ink);">居宅介護支援（ケアマネジャー）</span><br>TEL：0538-31-5551<br>
                <span style="font-weight:700; color:var(--ink);">サ高住 見付</span> TEL：0538-31-3308<br>
                <span style="font-weight:700; color:var(--ink);">サ高住 安久路</span> TEL：0538-37-1010<br>
                <a href="https://www.fujigaoka-service.info/" target="_blank" rel="noopener" style="color:var(--green-d); font-weight:700; text-decoration:underline;">ホームページ ↗</a>
              </div>
            </div>
            <div style="margin-top:16px;">
              <a href="https://www.fujigaoka-service.info/" target="_blank" rel="noopener" class="print-btn" style="display:flex; justify-content:center; text-align:center; background:var(--green); color:#fff; border:none; border-radius:8px; padding:10px; font-size:14px; font-weight:700; cursor:pointer; text-decoration:none; width:100%;">
                介護について相談する
              </a>
            </div>
          </div>

          <!-- カード 3: 磐田物語 -->
          <div class="consult-card" style="background:#fff; border: 1.5px solid var(--line); border-radius:14px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            <div>
              <h4 style="margin:0 0 10px 0; font-size:16px; font-weight:800; color:var(--green-d); display:flex; align-items:center; gap:6px;">
                <span>📖</span> <span>磐田をもっと知りたい</span>
              </h4>
              <p style="margin:0 0 12px 0; font-size:13.5px; line-height:1.5; color:var(--ink);">
                磐田の歴史、文化、古写真、人物、地域の記憶を未来へ残す地域アーカイブサイトです。
              </p>
              <div style="border-top:1px dashed var(--line); padding-top:8px; margin-top:8px; font-size:13px; color:var(--mut); line-height:1.6;">
                <b style="color:var(--ink); font-size:13.5px;">磐田物語</b><br>
                <a href="https://iwata-monogatari.pages.dev/" target="_blank" rel="noopener" style="color:var(--green-d); font-weight:700; text-decoration:underline;">ホームページ ↗</a>
              </div>
            </div>
            <div style="margin-top:16px;">
              <a href="https://iwata-monogatari.pages.dev/" target="_blank" rel="noopener" class="print-btn" style="display:flex; justify-content:center; text-align:center; background:var(--green); color:#fff; border:none; border-radius:8px; padding:10px; font-size:14px; font-weight:700; cursor:pointer; text-decoration:none; width:100%;">
                磐田物語を見る
              </a>
            </div>
          </div>

        </div>
      </div>
    `
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
