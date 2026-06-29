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

// ===== スマホファースト v1.0: 困りごと =====================

export type StepTiming = 'today' | 'this_week' | 'later';
export type FeedbackType = 'solved' | 'still_worried' | 'could_not_find' | 'wrong_page';

export interface ProcedureStep {
  step_order: number;
  timing: StepTiming;
  task_name: string;
  deadline?: string | null;
  window_name?: string | null;
  required_items?: string[] | null;
  outside_agency?: string | null;
  is_municipal: 0 | 1;
  nav_tags?: string[] | null;
  note?: string | null;
}

export interface TroubleGuide {
  slug: string;            // 出来事ID（共通）
  title: string;
  situation_label: string; // トップのカード文言
  summary: string;
  first_action: string;
  target_person?: string | null;
  priority: 'A+' | 'A' | 'B';
  steps: ProcedureStep[];
}

/** 困りごとページのDB読み出し行（trouble_guides） */
export interface TroubleGuideRow {
  id: string;
  municipality_id: string;
  slug: string;
  title: string;
  situation_label: string | null;
  summary: string | null;
  first_action: string | null;
  target_person: string | null;
  priority: string | null;
  display_order: number | null;
  last_verified_at: string | null;
  status: string | null;
}

export interface ProcedureStepRow {
  id: string;
  trouble_guide_id: string;
  step_order: number;
  timing: string | null;
  task_name: string;
  deadline: string | null;
  window_name: string | null;
  required_items: string | null; // 改行区切り
  official_page_id: string | null;
  outside_agency: string | null;
  is_municipal: number;
  nav_tags: string | null;        // カンマ区切り
  note: string | null;
}

/** コード側の出来事メタ（公式リンク・3問ナビ・類語） */
export interface EventMeta {
  categoryId: string | null;     // 関連する共通カテゴリ
  officialUrl: string;           // 公式サイトの該当セクション
  officialLabel: string;
  careFunnel?: boolean;          // 介護・福祉導線を出すか
  nav?: TroubleNav;
}

export interface TroubleNav {
  intro: string;
  questions: TroubleNavQuestion[];
}

export interface TroubleNavQuestion {
  id: string;
  label: string;
  /** 「いいえ」のとき隠すステップ step_order */
  hideStepOrdersIfNo: number[];
  /** 「いいえ」のとき表示する補足 */
  noteIfNo?: string;
}
