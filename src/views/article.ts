// ============================================================
// 記事ページ本文（A+/A/B）
// 記事本文(body)が未生成(pending)の場合は、設計書の記事構成テンプレートと
// 公式ページへの案内を表示する。公式文章は丸写ししない。
// ============================================================

import type { Municipality, OfficialPage } from '../types';
import { esc, fmtDate } from '../util';
import { priorityBadge } from './layout';

interface Article {
  title: string;
  summary: string | null;
  body: string | null;
  status: string | null;
  generated_level: string | null;
}

export function articleBody(muni: Municipality, article: Article, page: OfficialPage): string {
  const base = `/${muni.slug}`;
  const checked = page.last_checked_at ? fmtDate(page.last_checked_at) : '';
  const updated = page.official_updated_at ? fmtDate(page.official_updated_at) : '';

  const content =
    article.body && article.status === 'published'
      ? `<div class="card">${article.body}</div>`
      : pendingTemplate(article.generated_level);

  return `
  <p class="muted"><a href="${base}/">${esc(muni.short_name)}ハック</a>${page.category ? ` ／ <a href="${base}/category/${esc(page.category)}/">${esc(page.category)}</a>` : ''}</p>
  <h1 class="page">${priorityBadge(page.priority)} ${esc(article.title)}</h1>
  ${article.summary ? `<p>${esc(article.summary)}</p>` : ''}

  ${content}

  <a class="official-link" href="${esc(page.official_url)}" rel="noopener">${esc(muni.name)}の公式ページで詳細・最新情報を確認する ↗</a>
  <p class="meta">${updated ? `公式ページ最終更新：${esc(updated)}　` : ''}${checked ? `当サイト最終確認：${esc(checked)}` : ''}</p>
  `;
}

/** 記事未生成時のテンプレート（記事化可能な状態のプレースホルダ） */
function pendingTemplate(level: string | null): string {
  const note =
    level === 'detailed'
      ? '詳細解説記事（A+）'
      : level === 'medium'
      ? '中程度の解説記事（A）'
      : '短い解説記事（B）';
  return `<div class="card">
    <p class="muted">この記事（${esc(note)}）は現在準備中です。下記の公式ページに最新・正確な情報があります。</p>
    <ul class="muted">
      <li>何の情報か</li>
      <li>誰に関係するか</li>
      <li>何をすればよいか</li>
      <li>注意点</li>
      <li>公式ページリンク（下記）</li>
      <li>最終確認日（下記）</li>
    </ul>
  </div>`;
}
