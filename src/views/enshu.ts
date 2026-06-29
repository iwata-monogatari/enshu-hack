// ============================================================
// 遠州ハック統合ページ本文
// 有効化された全自治体（初期は磐田のみ）を統合表示する。
// ============================================================

import type { Category, DailyChange, Municipality } from '../types';
import { esc, fmtDate } from '../util';
import { priorityBadge } from './layout';

interface EnshuRow {
  municipality_id: string;
  muni_short: string;
  normalized_category_id: string | null;
  title: string;
  url: string;
  priority: string | null;
  updated_at: string | null;
}

export function enshuTopBody(
  activeMunis: Municipality[],
  categories: Category[],
  recent: DailyChange[],
  muniShortById: Record<string, string>,
): string {
  const muniLinks = activeMunis
    .map((m) => `<a class="tile" href="/${esc(m.slug)}/"><b>${esc(m.short_name)}ハック</b><div class="n">${esc(m.name)}</div></a>`)
    .join('');

  const catLinks = categories
    .map((c) => `<a class="tile" href="/enshu/${esc(c.id)}/"><b>${esc(c.name)}</b> ${priorityBadge(c.priority)}</a>`)
    .join('');

  const updates =
    recent.length > 0
      ? recent
          .map(
            (c) => `<div class="update-item">
              <span class="ct ct-${esc(c.change_type)}">${esc(muniShortById[c.municipality_id] || '')}</span>
              ${priorityBadge(c.priority_snapshot)}
              <a href="${esc(c.official_url_snapshot || '#')}" rel="noopener">${esc(c.title_snapshot || '(無題)')}</a> ↗
              <span class="meta"> ${esc(fmtDate(c.detected_at))}</span>
            </div>`,
          )
          .join('')
      : '<div class="empty">最近の更新はまだありません。</div>';

  return `
  <h1 class="page">遠州ハック</h1>
  <p class="muted">遠州エリア（磐田・袋井・掛川・森町・浜松）の自治体情報を統合してご案内します。現在の有効エリア：${activeMunis.map((m) => esc(m.short_name)).join('・')}。</p>

  <h2 class="sec">遠州エリア 本日の更新</h2>
  ${updates}

  <h2 class="sec">市町別ページ</h2>
  <div class="grid">${muniLinks}</div>

  <h2 class="sec">カテゴリ別（遠州横断）</h2>
  <div class="grid">${catLinks}</div>
  `;
}

export function enshuCategoryBody(category: Category, rows: EnshuRow[]): string {
  const items = rows
    .map(
      (r) => `<div class="card">
        ${priorityBadge(r.priority)} <span class="badge b-C">${esc(r.muni_short)}</span>
        <b><a href="${esc(r.url)}" rel="noopener">${esc(r.title)}</a> ↗</b>
        ${r.updated_at ? `<div class="meta">${esc(fmtDate(r.updated_at))}</div>` : ''}
      </div>`,
    )
    .join('');
  return `
  <p class="muted"><a href="/enshu/">遠州ハック</a> ／ ${esc(category.name)}</p>
  <h1 class="page">遠州の${esc(category.name)} ${priorityBadge(category.priority)}</h1>
  <p class="muted">${rows.length} 件</p>
  ${items || '<div class="empty">この遠州カテゴリの統合データはまだありません。</div>'}
  `;
}
