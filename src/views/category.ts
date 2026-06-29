// ============================================================
// カテゴリページ本文
// A+/A/B は記事リンク（記事枠）、C は公式リンクカードのみ。
// ============================================================

import type { Category, Municipality, OfficialPage } from '../types';
import { SALES_ALLOWED_CATEGORIES } from '../config';
import { esc, fmtDate } from '../util';
import { priorityBadge } from './layout';

export function categoryBody(
  muni: Municipality,
  category: Category,
  pages: OfficialPage[],
  articleSlugByPageId: Record<string, string>,
): string {
  const base = `/${muni.slug}`;

  const items = pages
    .map((p) => {
      const isC = p.priority === 'C';
      const updated = p.official_updated_at ? `<span class="meta">最終更新 ${esc(fmtDate(p.official_updated_at))}</span>` : '';
      if (isC) {
        // C: 独自解説なし。公式リンクカードのみ。
        return `<div class="card">
          ${priorityBadge(p.priority)} <b>${esc(p.title)}</b>
          <div><a class="official-link" href="${esc(p.official_url)}" rel="noopener">${esc(muni.name)}公式ページを見る ↗</a></div>
          ${updated}
        </div>`;
      }
      // A+/A/B: 記事枠があれば記事へ、無ければ公式リンク
      const slug = articleSlugByPageId[p.id];
      const titleLink = slug
        ? `<a href="${base}/article/${esc(slug)}/">${esc(p.title)}</a>`
        : esc(p.title);
      return `<div class="card">
        ${priorityBadge(p.priority)} <b>${titleLink}</b>
        <div><a class="official-link" href="${esc(p.official_url)}" rel="noopener">公式ページ ↗</a></div>
        ${updated}
      </div>`;
    })
    .join('');

  const careBlock = SALES_ALLOWED_CATEGORIES.has(category.id)
    ? `<div class="care-cta"><b>介護・福祉のご相談</b><br>
       介護施設さがし・高齢者支援・地域包括支援センター関連のことは、運営の<b>富士ヶ丘サービス</b>へご相談ください。</div>`
    : '';

  return `
  <p class="muted"><a href="${base}/">${esc(muni.short_name)}ハック</a> ／ ${esc(category.name)}</p>
  <h1 class="page">${esc(category.name)} ${priorityBadge(category.priority)}</h1>
  <p class="muted">${pages.length} 件のページ</p>
  ${careBlock}
  ${items || '<div class="empty">このカテゴリのページはまだ取得されていません。</div>'}
  `;
}
