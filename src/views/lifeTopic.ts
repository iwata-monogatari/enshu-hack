// ============================================================
// 中項目（生活トピック）詳細ページ本文
// 指示書の9. ページテンプレート13構成を完全にサポート
// ============================================================

import type { Municipality, TroubleGuideRow, ProcedureStepRow } from '../types';
import { esc, fmtDate } from '../util';

export function lifeTopicBody(
  muni: Municipality,
  catSlug: string,
  topicSlug: string,
  guide: TroubleGuideRow,
  steps: ProcedureStepRow[],
  consultType?: string,
): string {
  const base = `/${muni.slug}`;

  // 1. 一行で結論 / 3. まず何をするか
  const firstActionHtml = guide.first_action
    ? `<div class="first-action">💡 <b>まずやること：</b>${esc(guide.first_action)}</div>`
    : '';

  // 2. 誰に関係するか
  const whoNeedsHtml = guide.who_needs_this
    ? `<div class="card" style="border-left: 5px solid var(--green); margin-bottom: 20px;">
        <span class="chip chip-muni" style="background:var(--green); color:#fff; font-size:12px;">対象となる方</span>
        <p style="margin: 8px 0 0 0; font-weight:700;">${esc(guide.who_needs_this)}</p>
       </div>`
    : '';

  // 4. 今日やること / 5. 今週やること / 6. 後日でよいこと
  // DBの trouble_guides.today_tasks 等（改行区切り）からリスト化
  const renderTaskList = (tasksStr: string | null, title: string, colorClass: string, dotClass: string) => {
    if (!tasksStr) return '';
    const tasks = tasksStr.split('\n').map(t => t.trim()).filter(Boolean);
    if (tasks.length === 0) return '';
    
    const listItems = tasks.map(t => `
      <div class="step">
        <div class="task">
          <span class="chip chip-muni" style="background:#e7f1ec; color:#1f6f54;">手続き</span>
          ${esc(t)}
        </div>
      </div>
    `).join('');

    return `
      <div class="timing-block" style="margin-top: 24px;">
        <div class="timing-head ${colorClass}" style="font-size:16px; font-weight:800; display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <span class="tdot ${dotClass}" style="width:12px; height:12px; border-radius:50%; display:inline-block;"></span>
          ${esc(title)}
        </div>
        ${listItems}
      </div>
    `;
  };

  const todayHtml = renderTaskList(guide.today_tasks, '今日やること', 'timing-today', 'today');
  const thisWeekHtml = renderTaskList(guide.this_week_tasks, '今週やること', 'timing-week', 'week');
  const laterHtml = renderTaskList(guide.later_tasks, '後日でよいこと', 'timing-later', 'later');

  // 7. 必要なもの
  const requiredItemsHtml = () => {
    if (!guide.required_items) return '';
    const items = guide.required_items.split('\n').map(i => i.trim()).filter(Boolean);
    if (items.length === 0) return '';
    return `
      <h2 class="sec">必要な持ち物・書類</h2>
      <div class="step">
        <ul class="items" style="margin: 0; padding-left: 20px;">
          ${items.map(i => `<li style="margin-bottom: 6px; font-weight:600;">${esc(i)}</li>`).join('')}
        </ul>
      </div>
    `;
  };

  // 8. 市役所でできること / 9. 市役所以外で必要なこと
  const windowsHtml = () => {
    if (!guide.municipal_window && !guide.outside_agencies) return '';
    return `
      <h2 class="sec">手続きの窓口</h2>
      <div class="step" style="display: flex; flex-direction: column; gap: 12px;">
        ${guide.municipal_window ? `
          <div>
            <span class="chip chip-muni">市役所の窓口</span>
            <span style="font-weight:700; margin-left: 8px;">${esc(guide.municipal_window)}</span>
          </div>
        ` : ''}
        ${guide.outside_agencies ? `
          <div>
            <span class="chip chip-out" style="background:#fdeede; color:#a8631a;">市役所以外の窓口</span>
            <span style="font-weight:700; margin-left: 8px;">${esc(guide.outside_agencies)}</span>
          </div>
        ` : ''}
      </div>
    `;
  };

  // 10. 注意点
  const cautionHtml = guide.caution
    ? `<h2 class="sec" style="color:#b3261e; border-left-color:#b3261e;">注意点・アドバイス</h2>
       <div class="step" style="border-color:#fbe2e2; background:#fffbfb;">
         <p style="margin: 0; font-weight:700; color:#b3261e;">⚠️ ${esc(guide.caution)}</p>
       </div>`
    : '';

  // 11. 公式ページ
  const officialSourcesHtml = () => {
    if (!guide.official_sources) {
      return `
        <h2 class="sec">公式情報</h2>
        <div class="step">
          <p class="muted" style="margin: 0;">市公式サイトで要確認</p>
        </div>
      `;
    }
    // フォーマット: "タイトル|URL\nタイトル|URL"
    const sources = guide.official_sources.split('\n').map(s => s.trim()).filter(Boolean);
    if (sources.length === 0) {
      return `
        <h2 class="sec">公式情報</h2>
        <div class="step">
          <p class="muted" style="margin: 0;">市公式サイトで要確認</p>
        </div>
      `;
    }

    const links = sources.map(s => {
      const parts = s.split('|');
      const title = parts[0] || `${muni.name}公式情報`;
      const url = parts[1] || muni.official_base_url;
      return `<a class="official-link" href="${esc(url)}" target="_blank" rel="noopener" style="margin-right: 10px; margin-bottom: 8px;">${esc(title)} ↗</a>`;
    }).join('');

    return `
      <h2 class="sec">公式情報</h2>
      <div style="display: flex; flex-wrap: wrap;">
        ${links}
      </div>
    `;
  };

  // 12. 最終確認日
  const verifiedHtml = `
    <p class="verified" style="font-size:12.5px; color:var(--mut); margin-top:20px;">
      最終確認日：${esc(fmtDate(guide.last_verified_at || '2026-06-29'))} ／ 本サイトは公式情報を整理したものです。最新・正確な情報は必ず公式ページでご確認ください。
    </p>
  `;

  // 13. これで解決しそうですか？（フィードバック）
  const feedbackHtml = `
    <div class="feedback" id="fb" style="margin-top: 32px; background:#fff; border: 1.5px solid var(--line); border-radius:14px; padding:20px; text-align:center;">
      <h3 style="margin:0 0 14px 0; font-size:17px; color:var(--green-d);">このページの情報は役に立ちそうですか？</h3>
      <div class="fb-btns" style="display:flex; flex-direction:row; gap:10px; justify-content:center; flex-wrap:wrap;">
        <button type="button" data-fb="solved" class="print-btn" style="border-color:var(--green); color:var(--green-d); cursor:pointer; min-width: 140px;">👍 解決しそう</button>
        <button type="button" data-fb="still_worried" class="print-btn" style="cursor:pointer; min-width: 140px;">🤔 まだ不安</button>
        <button type="button" data-fb="could_not_find" class="print-btn" style="cursor:pointer; min-width: 180px;">❌ 探す情報がない</button>
      </div>
      <div class="fb-thanks" id="fbThanks" style="display:none; font-weight:700; color:var(--green-d); padding:8px 0;">ありがとうございます。改善に役立てます。</div>
    </div>
  `;

  // 相談導線の表示判定と動的ソート
  const consultCtaHtml = getSortedConsultCtaHtml(catSlug, consultType, muni.slug);

  // AI相談・キーワードから探す導線
  const aiSearchCtaHtml = `
    <div class="ai-consult-cta" style="background:#f6f7f5; border:1px dashed var(--line); border-radius:14px; padding:18px; margin-top:24px; text-align:center;">
      <h4 style="margin:0 0 8px 0; font-size:15px; color:var(--ink);">🔍 まだ見つかりませんか？</h4>
      <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
        <a class="print-btn" href="${base}/navigate?q=AI相談" style="cursor:pointer; background:#fff;">🤖 AIに相談する</a>
        <a class="print-btn" href="${base}/" style="cursor:pointer; background:#fff;">📋 キーワードから探す</a>
      </div>
    </div>
  `;

  // 電話前チェック
  const phoneCheckHtml = `
    <h2 class="sec">電話する前チェック</h2>
    <div class="step">
      <ul class="items" style="margin: 0; padding-left: 20px; font-size:14px; line-height:1.6;">
        <li>用件を一言でまとめる（「<b>${esc(guide.title)}</b>」について聞きたい等）</li>
        <li>手元に<b>本人確認書類</b>（運転免許証やマイナンバーカード等）を用意する</li>
        <li>関係する通知書や保険証があれば、事前に手元に置く</li>
        <li>市役所窓口の受付時間は通常 <b>平日 8:30 〜 17:15</b> です</li>
      </ul>
    </div>
  `;

  // PC右カラム（今日やること・電話前チェック・印刷）
  const todayTasksList = guide.today_tasks ? guide.today_tasks.split('\n').map(t => t.trim()).filter(Boolean) : [];
  const rail = `<aside class="pcrail" style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <h3 style="margin:0 0 8px 0; font-size:15px; color:var(--green-d); border-bottom:1.5px solid var(--line); padding-bottom:4px;">今日やること</h3>
      <ul style="margin:0; padding-left:18px; font-size:13.5px; line-height:1.6;">
        ${todayTasksList.length ? todayTasksList.map((t) => `<li>${esc(t)}</li>`).join('') : '<li>急ぎの手続きはありません</li>'}
      </ul>
    </div>
    <div>
      <h3 style="margin:0 0 8px 0; font-size:15px; color:var(--green-d); border-bottom:1.5px solid var(--line); padding-bottom:4px;">電話前チェック</h3>
      <ul style="margin:0; padding-left:18px; font-size:13px; line-height:1.5;">
        <li>用件を一言で</li>
        <li>本人確認書類</li>
        <li>関係書類</li>
        <li>受付時間確認</li>
      </ul>
    </div>
    <div style="margin-top:8px;">
      <a class="print-btn" href="#" onclick="window.print();return false" style="display:flex; justify-content:center; cursor:pointer;">🖨️ 印刷して持参する</a>
    </div>
  </aside>`;

  const content = `
    <p class="muted" style="font-size:13px; margin-bottom:8px;">
      <a href="${base}/">${esc(muni.short_name)}ライフハック</a> ／ 
      <a href="${base}/#life-categories-section">生活ナビ</a> ／ 
      <span>${esc(guide.title)}</span>
    </p>
    <h1 class="page" style="font-size:24px; font-weight:800; margin-bottom:12px; color:var(--green-d);">${esc(guide.title)}</h1>
    ${guide.summary ? `<p class="lead" style="font-size:15px; margin-bottom:20px;">${esc(guide.summary)}</p>` : ''}

    ${firstActionHtml}
    ${whoNeedsHtml}
    ${todayHtml}
    ${thisWeekHtml}
    ${laterHtml}
    ${requiredItemsHtml()}
    ${windowsHtml()}
    ${cautionHtml}
    ${phoneCheckHtml}
    ${officialSourcesHtml()}
    ${verifiedHtml}
    ${consultCtaHtml}
    ${aiSearchCtaHtml}
    ${feedbackHtml}
  `;

  return `
    <div class="with-rail">
      <div>${content}</div>
      ${rail}
    </div>
    ${feedbackScript(muni.id, guide.id)}
  `;
}

function feedbackScript(municipalityId: string, guideId: string): string {
  return `<script>
  (function(){
    document.querySelectorAll('.fb-btns button[data-fb]').forEach(function(b){
      b.addEventListener('click', function(){
        var type = b.getAttribute('data-fb');
        fetch('/api/feedback', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            muni: ${JSON.stringify(municipalityId)},
            guide: ${JSON.stringify(guideId)},
            type: type
          })
        }).catch(function(){});
        document.querySelector('.fb-btns').style.display = 'none';
        document.getElementById('fbThanks').style.display = 'block';
      });
    });
  })();
  </script>`;
}

/** 相談カード並び順を動的にソートしてHTMLを生成するヘルパー関数 */
export function getSortedConsultCtaHtml(catSlug: string, consultType?: string, muniSlug = 'iwata'): string {

  const cardStory = `
          <!-- カード: 磐田物語 -->
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
  `;

  const cardRealEstate = `
          <!-- カード: 住まい -->
          <div class="consult-card" style="background:#fafafa; border: 1px solid var(--line); border-radius:12px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; box-shadow: 0 1px 4px rgba(0,0,0,0.01);">
            <div>
              <h4 style="margin:0 0 8px 0; font-size:15.5px; font-weight:700; color:var(--ink); display:flex; align-items:center; gap:6px;">
                <span>🏠</span> <span>家・住まいについて相談したい</span>
              </h4>
              <p style="margin:0 0 16px 0; font-size:13px; line-height:1.5; color:var(--mut);">
                富士ヶ丘サービスでも、相続した実家・空き家・親の家の整理についてご相談をお受けしています。介護と不動産の両方に関わる立場から、売却・管理・解体・今後の住まい方について整理のお手伝いをしています。必要に応じて、相談先の一つとしてご利用ください。
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
                相続した実家・空き家について相談する
              </a>
            </div>
          </div>
  `;

  const cardNursing = `
          <!-- カード: 介護 -->
          <div class="consult-card" style="background:#fafafa; border: 1px solid var(--line); border-radius:12px; padding:18px; display:flex; flex-direction:column; justify-content:space-between; box-shadow: 0 1px 4px rgba(0,0,0,0.01);">
            <div>
              <h4 style="margin:0 0 8px 0; font-size:15.5px; font-weight:700; color:var(--ink); display:flex; align-items:center; gap:6px;">
                <span>❤️</span> <span>介護・高齢者について相談したい</span>
              </h4>
              <p style="margin:0 0 16px 0; font-size:13px; line-height:1.5; color:var(--mut);">
                ケアマネジャー、介護保険、介護施設、高齢者支援などのご相談を承っています。必要に応じて、相談先の一つとしてご利用ください。
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
  `;

  let ordered: string[] = [];
  const type = consultType || (catSlug === 'housing' ? 'real_estate' : catSlug === 'parents-care' ? 'nursing' : 'other');
  if (type === 'real_estate') {
    ordered = [cardRealEstate, cardStory, cardNursing];
  } else if (type === 'nursing') {
    ordered = [cardNursing, cardRealEstate, cardStory];
  } else {
    ordered = [cardStory, cardRealEstate, cardNursing];
  }
  if (muniSlug !== 'iwata') {
    ordered = ordered.filter((card) => !card.includes('<!-- カード: 磐田物語 -->'));
  }

  return `
    <div class="consult-section" style="margin-top: 36px; border-top: 1.5px solid var(--line); padding-top: 24px;">
      <h3 style="font-size: 17px; font-weight: 800; color: var(--ink); margin: 0 0 10px 0; text-align: center;">
        お困りのときは、相談先の一つとしてご利用ください
      </h3>
      <p style="font-size: 14px; line-height: 1.6; color: var(--mut); text-align: center; max-width: 600px; margin: 0 auto 24px auto;">
        相続した実家や空き家、介護、住まいに関する悩みは、一人で抱え込まず、地域の相談窓口や専門家へ相談することで解決につながることがあります。
        富士ヶ丘サービスでも、このようなご相談をお受けしています。
      </p>
      <div class="consult-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 24px;">
        ${ordered.join('')}
      </div>
    </div>
  `;
}
