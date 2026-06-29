import type { DailyChange, Municipality, LifeCategoryRow, LifeTopicRow } from '../types';
import { esc } from '../util';

export function troubleTopBody(
  muni: Municipality,
  categories: LifeCategoryRow[],
  topics: LifeTopicRow[],
  changes: DailyChange[],
  changesAreToday: boolean,
  emergencyMode = false,
): string {
  const base = `/${muni.slug}`;

  // 13大項目と中項目のマッピング作成
  const categoryTopicMap: Record<string, LifeTopicRow[]> = {};
  for (const c of categories) {
    categoryTopicMap[c.id] = topics.filter((t) => t.category_id === c.id);
  }

  // 災害時表示（emergency_mode が true の場合、防災カードを最上位に昇格）
  let featuredCategories = [...categories];
  if (emergencyMode) {
    // slug が 'emergency' のカテゴリを先頭に移動する
    const bousaiIndex = featuredCategories.findIndex(c => c.slug === 'emergency');
    if (bousaiIndex > -1) {
      const bousai = featuredCategories.splice(bousaiIndex, 1)[0];
      featuredCategories.unshift(bousai);
    }
  }

  // 8カードのリンク先定義（中項目が存在しない場合のフォールバックは大項目ページへ）
  const getTopicLink = (catSlug: string, topicSlug: string) => {
    const tExists = topics.some(t => t.slug === topicSlug);
    if (tExists) return `${base}/life/${catSlug}/${topicSlug}/`;
    return `${base}/life/${catSlug}/`;
  };

  // 6.2 最初に表示する8カード
  // emergencyMode の場合は防災カードを一番目立たせる（アニメーションや赤枠などで強調）
  const cards = [
    { title: '🌱 磐田市に住みたい', href: getTopicLink('living-soon', 'want-to-live') },
    { title: '🚚 磐田市へ引っ越してきた', href: getTopicLink('start-living', 'moved-in') },
    { title: '🏠 家・住まい', href: `${base}/life/housing/` },
    { title: '🗑️ ごみを出したい', href: getTopicLink('start-living', 'how-to-garbage') },
    { title: '🌳 公園・施設を探したい', href: getTopicLink('play-out', 'find-parks') },
    { title: '👶 子育て', href: `${base}/life/family-grow/` },
    { title: '🧓 介護・親のこと', href: `${base}/life/parents-care/` },
    { title: '🚨 防災・緊急', href: `${base}/life/emergency/`, isUrgent: true }
  ];

  // emergencyMode の場合は防災カードを先頭にする
  if (emergencyMode) {
    const bIndex = cards.findIndex(c => c.isUrgent);
    if (bIndex > -1) {
      const bousaiCard = cards.splice(bIndex, 1)[0];
      cards.unshift(bousaiCard);
    }
  }

  const cardsHtml = cards.map(c => `
    <a class="u-card ${c.isUrgent ? 'u-bousai-active' : ''}" href="${c.href}" ${c.isUrgent ? 'style="background:#c0461e; font-weight:900;"' : 'style="background:var(--green);"'}>
      <span>${esc(c.title)}</span>
      <span class="s">${c.isUrgent ? '【緊急】避難情報・災害リスクを確認' : '暮らしのナビ'}</span>
    </a>
  `).join('');

  // 13大項目・中項目のリストHTML（初期表示は非表示）
  const categoriesListHtml = featuredCategories.map(c => {
    const subTopics = categoryTopicMap[c.id] || [];
    const subTopicsHtml = subTopics.map(t => `
      <li>
        <a href="${base}/life/${c.slug}/${t.slug}/">
          <span class="ic">${esc(t.icon || '📝')}</span>
          <span class="t-title">${esc(t.title)}</span>
        </a>
      </li>
    `).join('');

    return `
      <div class="category-block" id="cat-${esc(c.slug)}">
        <h3 class="cat-title">
          <span class="ic">${esc(c.icon || '🌱')}</span>
          <span class="c-title">${esc(c.title)}</span>
        </h3>
        ${c.subtitle ? `<p class="cat-sub">${esc(c.subtitle)}</p>` : ''}
        <ul class="topic-list">
          ${subTopicsHtml || '<li class="empty">トピックはありません</li>'}
        </ul>
      </div>
    `;
  }).join('');

  // 本日の更新フィルタ（表示しないものを除外）
  const excludeKeywords = [
    'お問い合わせ', 'お問い合せ', 'リンク集', '免責事項', '個人情報', 
    'プライバシーポリシー', '著作権', 'Google Analytics', 'アクセシビリティ', 
    'サイト利用案内', 'サイトマップ', 'ご利用案内', '利用規約'
  ];

  const filteredChanges = changes.filter(c => {
    const title = c.title_snapshot || '';
    return !excludeKeywords.some(keyword => title.includes(keyword));
  });

  const CHANGE_LABEL: Record<string, string> = {
    added: '新規',
    updated: '更新',
    title_changed: '改題',
    category_changed: '分類変更',
  };

  const updates =
    filteredChanges.length > 0
      ? filteredChanges
          .slice(0, 10)
          .map(
            (c) => `<div class="update-item">
              <span class="ct ct-${esc(c.change_type)}">${esc(CHANGE_LABEL[c.change_type] || c.change_type)}</span>
              <a href="${esc(c.official_url_snapshot || '#')}" target="_blank" rel="noopener">${esc(c.title_snapshot || '(無題)')}</a> ↗
            </div>`,
          )
          .join('')
      : '<div class="empty">本日の新着・更新はまだありません。</div>';

  return `
  ${emergencyMode ? `
    <div class="emergency-alert" style="background:#fbe2e2; border: 2px solid #b3261e; border-radius:14px; padding:16px; margin: 0 0 16px 0; color:#b3261e; font-weight:800;">
      ⚠️ 現在、台風・大雨などの気象情報または避難情報が発令されています。「防災・緊急」情報を最優先で確認してください。
    </div>
  ` : ''}

  <div class="hero-section">
    <h2 class="askbig" style="font-size:26px; margin-top:10px;">今、何を知りたいですか？</h2>
    <p class="lead" style="font-size:16px; line-height:1.6;">磐田市公式情報をもとに、暮らしの手続き・施設・防災・子育て・介護を、市民目線でわかりやすく案内します。</p>
  </div>

  <form class="searchbox" action="${base}/navigate" method="get" role="search" style="margin-bottom: 28px;">
    <input name="q" type="search" placeholder="例：ゴミの出し方／子育て支援／公園を探す／引っ越し" aria-label="知りたい手続きや困りごとを入力">
    <button type="submit">探す</button>
  </form>

  <div class="urgent-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-bottom: 24px;">
    ${cardsHtml}
  </div>

  <div class="more-section" style="text-align: center; margin: 24px 0 32px 0;">
    <button id="more-btn" class="print-btn" style="min-height: 48px; min-width: 200px; justify-content: center; font-size:16px; border-color:var(--green); color:var(--green-d); cursor:pointer;">
      👇 もっと探す（生活ガイドを表示）
    </button>
  </div>

  <div id="life-categories-section" style="display: none;">
    <h2 class="sec">生活ナビゲーション（13大項目）</h2>
    <div class="life-categories-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
      ${categoriesListHtml}
    </div>
  </div>

  <h2 class="sec">本日の更新${changesAreToday ? '' : '（直近）'}</h2>
  <div class="card" style="margin-bottom:24px;">
    ${updates}
  </div>

  <div class="care-cta" style="margin-top:24px;">
    <b>介護・住まいのご相談</b><br>
    磐田市での介護施設さがし、高齢者支援、地域包括支援センターのこと、また実家・空き家・相続した家の整理については、運営の富士ヶ丘サービスへお気軽にご相談ください。
  </div>

  <script>
    document.getElementById('more-btn')?.addEventListener('click', function() {
      const sec = document.getElementById('life-categories-section');
      if (sec) {
        sec.style.display = 'block';
        this.style.display = 'none';
        sec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  </script>

  <style>
    .category-block {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 16px;
    }
    .cat-title {
      margin: 0 0 6px 0;
      font-size: 18px;
      color: var(--green-d);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cat-sub {
      font-size: 12.5px;
      color: var(--mut);
      margin: 0 0 12px 0;
      line-height: 1.4;
    }
    .topic-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .topic-list li {
      border-bottom: 1px solid #f6f7f5;
      padding-bottom: 6px;
    }
    .topic-list li:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }
    .topic-list a {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
      color: var(--ink);
    }
    .topic-list a:hover {
      color: var(--green-d);
      text-decoration: none;
    }
    .topic-list .ic {
      font-size: 18px;
    }
    .u-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .u-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      text-decoration: none;
    }
    .emergency-alert {
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(179,38,30, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(179,38,30, 0); }
      100% { box-shadow: 0 0 0 0 rgba(179,38,30, 0); }
    }
  </style>
  `;
}
