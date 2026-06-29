// ============================================================
// 優先順位判定（A+ / A / B / C / D）＋ 共通カテゴリ割当
// ============================================================

import type { CategoryMapping, ClassifiedPage, Priority, SitemapEntry } from '../types';
import {
  CATEGORY_PRIORITY,
  DEFAULT_PATH_MAP,
  D_PATH_PATTERNS,
  D_TITLE_PATTERNS,
} from '../config';

/** D判定 */
export function isExcludedD(url: string, title: string): boolean {
  if (D_PATH_PATTERNS.some((re) => re.test(url))) return true;
  if (D_TITLE_PATTERNS.some((re) => re.test(title))) return true;
  return false;
}

/** URLのパス（先頭スラッシュ無し、index.html除去） */
function pathKey(url: string, baseUrl: string): string {
  try {
    const u = new URL(url);
    let p = u.pathname;
    const basePath = new URL(baseUrl).pathname.replace(/\/$/, '');
    if (basePath && p.startsWith(basePath)) p = p.slice(basePath.length);
    return p.replace(/^\/+/, '').replace(/index\.html?$/, '').replace(/\/$/, '');
  } catch {
    return '';
  }
}

/**
 * 1ページを分類する。
 * @param mappings DBから取得した当該自治体の category_mappings（優先使用）
 */
export function classifyPage(
  entry: SitemapEntry,
  baseUrl: string,
  mappings: CategoryMapping[],
): ClassifiedPage {
  const { url, title } = entry;

  // 1) D除外（最優先）
  if (isExcludedD(url, title)) {
    return { url, title, priority: 'D', categoryId: null, subcategory: null };
  }

  const key = pathKey(url, baseUrl);

  // 2) DB の category_mappings を「長い接頭辞優先」で照合
  const sorted = [...mappings].sort(
    (a, b) => b.official_category_name.length - a.official_category_name.length,
  );
  for (const map of sorted) {
    if (key === map.official_category_name || key.startsWith(map.official_category_name + '/')) {
      const priority = (map.priority as Priority) || CATEGORY_PRIORITY[map.normalized_category_id] || 'C';
      return {
        url,
        title,
        priority,
        categoryId: map.normalized_category_id,
        subcategory: map.official_category_name,
      };
    }
  }

  // 3) コード側デフォルト（DBにマッピングが無い自治体/パス向け）
  for (const { prefix, categoryId } of DEFAULT_PATH_MAP) {
    if (key === prefix || key.startsWith(prefix + '/')) {
      return {
        url,
        title,
        priority: CATEGORY_PRIORITY[categoryId] || 'C',
        categoryId,
        subcategory: prefix,
      };
    }
  }

  // 4) どれにも該当しない → C（公式リンクのみ・記事化しない）
  return { url, title, priority: 'C', categoryId: null, subcategory: firstSeg(key) };
}

function firstSeg(key: string): string | null {
  const seg = key.split('/')[0];
  return seg || null;
}
