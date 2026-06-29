// ============================================================
// 共通型定義
// ============================================================

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  DEFAULT_MUNICIPALITY: string;
  CRAWL_TOKEN: string;
  MAX_PAGES_PER_RUN: string;
}

export type Priority = 'A+' | 'A' | 'B' | 'C' | 'D';

export interface Municipality {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  official_base_url: string;
  sitemap_url: string | null;
  region: string | null;
  is_active: number;
  display_order: number | null;
}

export interface Category {
  id: string;
  name: string;
  normalized_name: string;
  priority: string | null;
  display_order: number | null;
  is_core: number;
}

export interface CategoryMapping {
  id: string;
  municipality_id: string;
  official_category_name: string;
  normalized_category_id: string;
  priority: string | null;
}

export interface OfficialPage {
  id: string;
  municipality_id: string;
  official_url: string;
  title: string;
  category: string | null;
  subcategory: string | null;
  page_type: string | null;
  priority: string | null;
  official_updated_at: string | null;
  first_seen_at: string | null;
  last_checked_at: string | null;
  content_hash: string | null;
  article_status: string | null;
  is_public: number;
}

export interface DailyChange {
  id: string;
  municipality_id: string;
  official_page_id: string | null;
  detected_at: string;
  change_type: 'added' | 'updated' | 'removed' | 'title_changed' | 'category_changed';
  previous_hash: string | null;
  current_hash: string | null;
  title_snapshot: string | null;
  official_url_snapshot: string | null;
  priority_snapshot: string | null;
}

/** サイトマップから抽出した1ページ分の生データ */
export interface SitemapEntry {
  url: string;
  title: string;
}

/** 分類後のページ（DB保存前の中間表現） */
export interface ClassifiedPage {
  url: string;
  title: string;
  priority: Priority;          // D を含む（D は保存しないが判定結果として持つ）
  categoryId: string | null;   // 共通カテゴリID
  subcategory: string | null;  // 公式パス接頭辞
}

/** クロール結果レポート */
export interface CrawlReport {
  municipalityId: string;
  startedAt: string;
  finishedAt: string;
  fetchedFromSitemap: number;
  excludedD: number;
  counts: { 'A+': number; A: number; B: number; C: number };
  saved: number;
  changes: { added: number; updated: number; removed: number; title_changed: number; category_changed: number };
  articleSlots: number;
  enshuIndexed: number;
  errors: string[];
}
