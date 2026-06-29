// ============================================================
// 困りごとページ本文（指示書6.1の11構造）
//  最初に出すのは説明ではなく「行動」。市役所/市役所以外を分ける。
//  3問ナビ・フィードバック・PC右カラム・印刷に対応。
// ============================================================

import type { EventMeta, Municipality, ProcedureStepRow, TroubleGuideRow } from '../types';
import { esc, fmtDate } from '../util';

const TIMING_INFO: Record<string, { label: string; cls: string; dot: string }> = {
  today: { label: '今日やること', cls: 'timing-today', dot: 'today' },
  this_week: { label: '今週やること', cls: 'timing-week', dot: 'week' },
  later: { label: '後日でよいこと', cls: 'timing-later', dot: 'later' },
};

function renderStep(s: ProcedureStepRow): string {
  const chips: string[] = [];
  if (s.deadline) chips.push(`<span class="chip chip-deadline">${esc(s.deadline)}</span>`);
  if (s.is_municipal === 1) {
    chips.push(`<span class="chip chip-muni">市役所</span>`);
  } else {
    chips.push(`<span class="chip chip-out">市役所以外</span>`);
  }
  const where = s.is_municipal === 1 ? s.window_name : s.outside_agency;
  const items = (s.required_items || '')
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);
  const itemsHtml = items.length
    ? `<ul class="items">${items.map((i) => `<li>持ち物：${esc(i)}</li>`).join('')}</ul>`
    : '';
  const meta: string[] = [];
  if (where) meta.push(`窓口：${esc(where)}`);
  if (s.note) meta.push(esc(s.note));
  return `<div class="step" data-order="${s.step_order}">
    <div class="task">${chips.join('')}${esc(s.task_name)}</div>
    ${meta.length ? `<div class="meta">${meta.join('｜')}</div>` : ''}
    ${itemsHtml}
  </div>`;
}

export function troubleGuideBody(
  muni: Municipality,
  guide: TroubleGuideRow,
  steps: ProcedureStepRow[],
  meta: EventMeta | undefined,
): string {
  const base = `/${muni.slug}`;

  // 2-4. 今日/今週/後日 のタイムライン
  const timingBlocks = (['today', 'this_week', 'later'] as const)
    .map((t) => {
      const group = steps.filter((s) => s.timing === t);
      if (!group.length) return '';
      const info = TIMING_INFO[t];
      return `<div class="timing-block">
        <div class="timing-head ${info.cls}"><span class="tdot ${info.dot}"></span>${info.label}</div>
        ${group.map(renderStep).join('')}
      </div>`;
    })
    .join('');

  // 5. 持ち物まとめ
  const allItems = Array.from(
    new Set(
      steps.flatMap((s) => (s.required_items || '').split('\n').map((x) => x.trim()).filter(Boolean)),
    ),
  );
  const itemsBlock = allItems.length
    ? `<h2 class="sec">持ち物</h2><div class="step"><ul class="items">${allItems
        .map((i) => `<li>${esc(i)}</li>`)
        .join('')}</ul></div>`
    : '';

  // 6-7. 市役所でやること / 市役所以外でやること
  const muniTasks = steps.filter((s) => s.is_municipal === 1);
  const outTasks = steps.filter((s) => s.is_municipal === 0);
  const splitBlock = `<h2 class="sec">市役所でやること／市役所以外でやること</h2>
    <div class="step">
      <div class="task"><span class="chip chip-muni">市役所</span></div>
      <ul class="items">${muniTasks.length ? muniTasks.map((s) => `<li>${esc(s.task_name)}${s.window_name ? `（${esc(s.window_name)}）` : ''}</li>`).join('') : '<li>特にありません</li>'}</ul>
      <div class="task" style="margin-top:10px"><span class="chip chip-out">市役所以外</span></div>
      <ul class="items">${outTasks.length ? outTasks.map((s) => `<li>${esc(s.task_name)}${s.outside_agency ? `（${esc(s.outside_agency)}）` : ''}</li>`).join('') : '<li>特にありません</li>'}</ul>
    </div>`;

  // 8. 電話する前チェック
  const windows = Array.from(new Set(steps.map((s) => s.window_name).filter(Boolean)));
  const phoneCheck = `<h2 class="sec">電話する前チェック</h2>
    <div class="step"><ul class="items">
      <li>用件を一言で伝える（「${esc(guide.title)}」の件）</li>
      <li>本人確認書類（運転免許証・マイナンバーカードなど）が手元にあるか</li>
      <li>関係する書類（保険証・通知書など）を用意したか</li>
      <li>窓口の受付時間を確認したか${windows.length ? `（${windows.map((w) => esc(w!)).join('・')} など）` : ''}</li>
    </ul></div>`;

  // 9. 公式ページ
  const officialBlock = `<h2 class="sec">公式ページで確認する</h2>
    <a class="official-link" href="${esc(meta?.officialUrl || muni.official_base_url)}" rel="noopener">${esc(meta?.officialLabel || `${muni.name}公式サイト`)} ↗</a>
    ${meta?.categoryId ? `　<a class="back-link" href="${base}/category/${esc(meta.categoryId)}/">関連カテゴリを見る</a>` : ''}`;

  // 10. 最終確認日
  const verified = `<p class="verified">最終確認日：${esc(fmtDate(guide.last_verified_at))}　／　最新・正確な情報は必ず公式ページでご確認ください。</p>`;

  // 11. フィードバック
  const feedback = `<div class="feedback" id="fb">
    <h3>これで解決しそうですか？</h3>
    <div class="fb-btns">
      <button type="button" data-fb="solved">はい、解決しそう</button>
      <button type="button" data-fb="still_worried">まだ不安</button>
      <button type="button" data-fb="could_not_find">探している情報がなかった</button>
    </div>
    <div class="fb-thanks" id="fbThanks">ありがとうございます。改善に役立てます。</div>
  </div>`;

  // 介護・福祉導線（許可カテゴリのみ）
  const careBlock = meta?.careFunnel
    ? `<div class="care-cta"><b>介護・福祉のご相談</b><br>介護施設さがし・高齢者支援・地域包括支援センター関連のことは、運営の<b>富士ヶ丘サービス</b>へご相談ください。</div>`
    : '';

  // 3問ナビ
  const navBlock = meta?.nav
    ? `<div class="nav3">
        <h3>必要な手続きだけ表示する</h3>
        <p class="muted" style="font-size:13.5px">${esc(meta.nav.intro)}</p>
        ${meta.nav.questions
          .map(
            (q) => `<div class="q" data-q="${esc(q.id)}">
              <p>${esc(q.label)}</p>
              <span class="toggle">
                <button type="button" data-q="${esc(q.id)}" data-a="yes" class="on">はい</button>
                <button type="button" data-q="${esc(q.id)}" data-a="no">いいえ</button>
              </span>
              <div class="qnote">${esc(q.noteIfNo || '')}</div>
            </div>`,
          )
          .join('')}
      </div>`
    : '';

  const navConfig = meta?.nav
    ? meta.nav.questions.map((q) => ({ id: q.id, hide: q.hideStepOrdersIfNo }))
    : [];

  // PC右カラム（補助）
  const todaySteps = steps.filter((s) => s.timing === 'today');
  const rail = `<aside class="pcrail">
    <h3>今日やること</h3>
    <ul>${todaySteps.length ? todaySteps.map((s) => `<li>${esc(s.task_name)}</li>`).join('') : '<li>急ぎの手続きはありません</li>'}</ul>
    <div class="rail-sec"><h3>電話前チェック</h3>
      <ul><li>用件を一言で</li><li>本人確認書類</li><li>関係書類</li><li>受付時間</li></ul></div>
    <div class="rail-sec"><a class="print-btn" href="#" onclick="window.print();return false">🖨 印刷する</a></div>
  </aside>`;

  const content = `
    <p class="muted"><a href="${base}/">${esc(muni.short_name)}ハック</a> ／ 困りごと</p>
    <h1 class="page">${esc(guide.title)}</h1>
    ${guide.summary ? `<p class="lead">${esc(guide.summary)}</p>` : ''}

    <div class="first-action">${esc(guide.first_action || '')}</div>

    ${navBlock}
    ${timingBlocks}
    ${itemsBlock}
    ${splitBlock}
    ${phoneCheck}
    ${officialBlock}
    ${verified}
    ${careBlock}
    ${feedback}
  `;

  return `<div class="with-rail"><div>${content}</div>${rail}</div>
  ${guideScript(muni.id, guide.id, navConfig)}`;
}

/** ナビ＆フィードバックのクライアントJS */
function guideScript(
  municipalityId: string,
  guideId: string,
  navConfig: Array<{ id: string; hide: number[] }>,
): string {
  return `<script>
(function(){
  var NAV = ${JSON.stringify(navConfig)};
  var ans = {};
  NAV.forEach(function(q){ ans[q.id] = 'yes'; });
  function apply(){
    var hide = {};
    NAV.forEach(function(q){ if(ans[q.id]==='no'){ q.hide.forEach(function(o){ hide[o]=1; }); } });
    document.querySelectorAll('.step[data-order]').forEach(function(el){
      var o = el.getAttribute('data-order');
      if(hide[o]) el.classList.add('hidden'); else el.classList.remove('hidden');
    });
  }
  document.querySelectorAll('.toggle button[data-q]').forEach(function(b){
    b.addEventListener('click', function(){
      var q=b.getAttribute('data-q'), a=b.getAttribute('data-a');
      ans[q]=a;
      document.querySelectorAll('.toggle button[data-q="'+q+'"]').forEach(function(x){ x.classList.toggle('on', x.getAttribute('data-a')===a); });
      var box=document.querySelector('.q[data-q="'+q+'"] .qnote'); if(box) box.style.display = (a==='no')?'block':'none';
      apply();
    });
  });
  // フィードバック
  document.querySelectorAll('.fb-btns button[data-fb]').forEach(function(b){
    b.addEventListener('click', function(){
      var type=b.getAttribute('data-fb');
      fetch('/api/feedback',{method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({muni:${JSON.stringify(municipalityId)},guide:${JSON.stringify(guideId)},type:type})}).catch(function(){});
      document.querySelector('.fb-btns').style.display='none';
      document.getElementById('fbThanks').style.display='block';
    });
  });
})();
</script>`;
}
