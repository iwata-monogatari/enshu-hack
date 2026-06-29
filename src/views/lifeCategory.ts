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
      <div class="consult-section" style="margin-top: 36px; border-top: 1.5px solid var(--line); padding-top: 24px;">
        <h3 style="font-size: 17px; font-weight: 800; color: var(--ink); margin: 0 0 10px 0; text-align: center;">
          お困りのときは、相談先の一つとしてご利用ください
        </h3>
        <p style="font-size: 14px; line-height: 1.6; color: var(--mut); text-align: center; max-width: 600px; margin: 0 auto 24px auto;">
          相続した実家や空き家、介護、住まいに関する悩みは、一人で抱え込まず、地域の相談窓口や専門家へ相談することで解決につながることがあります。
          富士ヶ丘サービスでも、このようなご相談をお受けしています。
        </p>
        
        <div class="consult-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 24px;">
          
          <!-- カード 1: 住まい -->
          <div class="consult-card" style="background:#fafafa; border: 1px solid var(--line); border-radius:12px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; box-shadow: 0 1px 4px rgba(0,0,0,0.01);">
            <div>
              <h4 style="margin:0 0 8px 0; font-size:15.5px; font-weight:700; color:var(--ink); display:flex; align-items:center; gap:6px;">
                <span>🏠</span> <span>家・住まいについて相談したい</span>
              </h4>
              <p style="margin:0 0 16px 0; font-size:13px; line-height:1.5; color:var(--mut);">
                相続した実家、空き家、住み替え、住宅購入や売却など、住まいに関するご相談を承っています。
              </p>
              
              <div style="border-top:1px solid var(--line); padding-top:10px; margin-top:10px; font-size:12px; color:var(--mut); line-height:1.5;">
                <span style="font-weight:700; color:var(--ink);">お問い合わせ</span><br>
                富士ヶ丘サービス 不動産部<br>
                TEL：0538-31-3308<br>
                <div style="margin-top:6px; display:flex; gap:10px; flex-wrap:wrap;">
                  <a href="https://www.fujigaoka-service.co.jp/" target="_blank" rel="noopener" style="color:var(--green-d); text-decoration:underline;">ホームページ ↗</a>
                  <a href="https://line.me/R/ti/p/%40487nnyec" target="_blank" rel="noopener" style="color:#05b04b; text-decoration:underline;">LINE公式 ↗</a>
                </div>
              </div>
            </div>
            <div style="margin-top:16px;">
              <a href="https://www.fujigaoka-service.co.jp/" target="_blank" rel="noopener" class="print-btn" style="display:flex; justify-content:center; text-align:center; background:#fff; border:1px solid var(--line); color:var(--green-d); border-radius:6px; padding:8px; font-size:13px; font-weight:700; cursor:pointer; text-decoration:none; width:100%; transition: background 0.2s;">
                住まいの相談先を見る
              </a>
            </div>
          </div>

          <!-- カード 2: 介護 -->
          <div class="consult-card" style="background:#fafafa; border: 1px solid var(--line); border-radius:12px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; box-shadow: 0 1px 4px rgba(0,0,0,0.01);">
            <div>
              <h4 style="margin:0 0 8px 0; font-size:15.5px; font-weight:700; color:var(--ink); display:flex; align-items:center; gap:6px;">
                <span>❤️</span> <span>介護・高齢者について相談したい</span>
              </h4>
              <p style="margin:0 0 16px 0; font-size:13px; line-height:1.5; color:var(--mut);">
                ケアマネジャー、介護保険、介護施設、高齢者支援などのご相談を承っています。
              </p>
              
              <div style="border-top:1px solid var(--line); padding-top:10px; margin-top:10px; font-size:11.5px; color:var(--mut); line-height:1.5;">
                <span style="font-weight:700; color:var(--ink); font-size:12px;">お問い合わせ</span><br>
                富士ヶ丘サービス 介護部門<br>
                ・居宅介護支援 TEL: 0538-31-5551<br>
                ・サ高住 見付 TEL: 0538-31-3308<br>
                ・サ高住 安久路 TEL: 0538-37-1010<br>
                <div style="margin-top:6px;">
                  <a href="https://www.fujigaoka-service.info/" target="_blank" rel="noopener" style="color:var(--green-d); text-decoration:underline;">ホームページ ↗</a>
                </div>
              </div>
            </div>
            <div style="margin-top:16px;">
              <a href="https://www.fujigaoka-service.info/" target="_blank" rel="noopener" class="print-btn" style="display:flex; justify-content:center; text-align:center; background:#fff; border:1px solid var(--line); color:var(--green-d); border-radius:6px; padding:8px; font-size:13px; font-weight:700; cursor:pointer; text-decoration:none; width:100%; transition: background 0.2s;">
                介護の相談先を見る
              </a>
            </div>
          </div>

          <!-- カード 3: 磐田物語 -->
          <div class="consult-card" style="background:#fafafa; border: 1px solid var(--line); border-radius:12px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; box-shadow: 0 1px 4px rgba(0,0,0,0.01);">
            <div>
              <h4 style="margin:0 0 8px 0; font-size:15.5px; font-weight:700; color:var(--ink); display:flex; align-items:center; gap:6px;">
                <span>📖</span> <span>磐田の歴史・文化を知りたい</span>
              </h4>
              <p style="margin:0 0 16px 0; font-size:13px; line-height:1.5; color:var(--mut);">
                磐田の歴史や文化、地域の記憶を紹介しています。
              </p>
              
              <div style="border-top:1px solid var(--line); padding-top:10px; margin-top:10px; font-size:12px; color:var(--mut); line-height:1.5;">
                <span style="font-weight:700; color:var(--ink);">お問い合わせ</span><br>
                磐田物語<br>
                <div style="margin-top:6px;">
                  <a href="https://iwata-monogatari.pages.dev/" target="_blank" rel="noopener" style="color:var(--green-d); text-decoration:underline;">ホームページ ↗</a>
                </div>
              </div>
            </div>
            <div style="margin-top:16px;">
              <a href="https://iwata-monogatari.pages.dev/" target="_blank" rel="noopener" class="print-btn" style="display:flex; justify-content:center; text-align:center; background:#fff; border:1px solid var(--line); color:var(--green-d); border-radius:6px; padding:8px; font-size:13px; font-weight:700; cursor:pointer; text-decoration:none; width:100%; transition: background 0.2s;">
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
