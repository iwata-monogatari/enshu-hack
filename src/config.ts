// ============================================================
// 分類ルール（優先順位ルール / D除外ルール）
// DBの category_mappings を補完するコード側デフォルト。
// 設計書「優先順位ルール」「D例」に対応。
// ============================================================

/**
 * D判定（DBに入れない・公開しない・リンクもしない）。
 * - 磐田市: 市長の部屋 配下パス `shichounoheya/`
 * - タイトルに市長系キーワードを含むもの。
 */
export const D_PATH_PATTERNS: RegExp[] = [
  /\/shichounoheya\//i, // 市長の部屋
];

export const D_TITLE_PATTERNS: RegExp[] = [
  /市長の部屋/,
  /市長交際費/,
  /市長スケジュール/,
  /市長フォト/,
  /市長メッセージ/,
  /市長の?所信/, // 市長所信表明 等も除外
  /施政方針/,
];

/**
 * 共通カテゴリの優先度（categories.priority と一致）。
 * category_mappings に該当が無い場合の最終フォールバックにも使う。
 */
export const CATEGORY_PRIORITY: Record<string, 'A+' | 'A' | 'B'> = {
  kurashi: 'A+',
  bousai: 'A+',
  shisetsu: 'A+',
  kosodate: 'A+',
  fukushi: 'A+',
  sangyou: 'A',
  event: 'A',
  saiyou: 'B',
  shingikai: 'B',
  shisei: 'B',
};

/**
 * category_mappings がDBから引けない場合のコード側デフォルト（磐田市）。
 * パス接頭辞 → 共通カテゴリID。長いキー（より具体的）から照合する。
 */
export const DEFAULT_PATH_MAP: Array<{ prefix: string; categoryId: string }> = [
  { prefix: 'kenkou_fukushi/kaigohoken', categoryId: 'fukushi' },
  { prefix: 'kurashi_tetsuzuki/gomi_recycle', categoryId: 'kurashi' },
  { prefix: 'shiseijouhou/shokuin_saiyou', categoryId: 'saiyou' },
  { prefix: 'bousai_anzen', categoryId: 'bousai' },
  { prefix: 'kurashi_tetsuzuki', categoryId: 'kurashi' },
  { prefix: 'kosodate_kyouiku', categoryId: 'kosodate' },
  { prefix: 'kenkou_fukushi', categoryId: 'fukushi' },
  { prefix: 'sports_midokoro', categoryId: 'event' },
  { prefix: 'sangyou_business', categoryId: 'sangyou' },
  { prefix: 'shigikai', categoryId: 'shingikai' },
  { prefix: 'shiseijouhou', categoryId: 'shisei' },
];

/** 営業導線を許可するカテゴリ（介護・福祉のみ。設計書「営業導線ルール」） */
export const SALES_ALLOWED_CATEGORIES = new Set(['fukushi']);

/** 記事 generated_level（優先度→生成レベル） */
export const LEVEL_BY_PRIORITY: Record<string, 'detailed' | 'medium' | 'short'> = {
  'A+': 'detailed',
  A: 'medium',
  B: 'short',
};
