// ============================================================
// D1 クエリヘルパー
// ============================================================

import type {
  Category,
  CategoryMapping,
  DailyChange,
  Municipality,
  OfficialPage,
} from '../types';

export async function getActiveMunicipalities(db: D1Database): Promise<Municipality[]> {
  const r = await db
    .prepare('SELECT * FROM municipalities WHERE is_active = 1 ORDER BY display_order')
    .all<Municipality>();
  return r.results ?? [];
}

export async function getAllMunicipalities(db: D1Database): Promise<Municipality[]> {
  const r = await db.prepare('SELECT * FROM municipalities ORDER BY display_order').all<Municipality>();
  return r.results ?? [];
}

export async function getMunicipalityBySlug(db: D1Database, slug: string): Promise<Municipality | null> {
  return await db.prepare('SELECT * FROM municipalities WHERE slug = ?').bind(slug).first<Municipality>();
}

export async function getCategoryMappings(db: D1Database, municipalityId: string): Promise<CategoryMapping[]> {
  const r = await db
    .prepare('SELECT * FROM category_mappings WHERE municipality_id = ?')
    .bind(municipalityId)
    .all<CategoryMapping>();
  return r.results ?? [];
}

export async function getCategories(db: D1Database): Promise<Category[]> {
  const r = await db.prepare('SELECT * FROM categories ORDER BY display_order').all<Category>();
  return r.results ?? [];
}

export async function getCategory(db: D1Database, id: string): Promise<Category | null> {
  return await db.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first<Category>();
}

export async function getPagesByMunicipality(db: D1Database, municipalityId: string): Promise<OfficialPage[]> {
  const r = await db
    .prepare('SELECT * FROM official_pages WHERE municipality_id = ?')
    .bind(municipalityId)
    .all<OfficialPage>();
  return r.results ?? [];
}

export async function getPublicPagesByCategory(
  db: D1Database,
  municipalityId: string,
  categoryId: string,
): Promise<OfficialPage[]> {
  const r = await db
    .prepare(
      `SELECT * FROM official_pages
       WHERE municipality_id = ? AND category = ? AND is_public = 1
       ORDER BY CASE priority WHEN 'A+' THEN 0 WHEN 'A' THEN 1 WHEN 'B' THEN 2 ELSE 3 END,
                official_updated_at DESC`,
    )
    .bind(municipalityId, categoryId)
    .all<OfficialPage>();
  return r.results ?? [];
}

export async function getPageById(db: D1Database, id: string): Promise<OfficialPage | null> {
  return await db.prepare('SELECT * FROM official_pages WHERE id = ?').bind(id).first<OfficialPage>();
}

/** カテゴリ別の公開ページ件数（トップ/カテゴリナビ用） */
export async function getCategoryCounts(
  db: D1Database,
  municipalityId: string,
): Promise<Record<string, number>> {
  const r = await db
    .prepare(
      `SELECT category AS id, COUNT(*) AS n FROM official_pages
       WHERE municipality_id = ? AND is_public = 1 AND category IS NOT NULL
       GROUP BY category`,
    )
    .bind(municipalityId)
    .all<{ id: string; n: number }>();
  const out: Record<string, number> = {};
  for (const row of r.results ?? []) out[row.id] = row.n;
  return out;
}

/**
 * sinceISO 以降の差分（「本日の更新」用）。
 * detected_at はUTC ISO で保存されるため、TZに依存しないよう
 * カレンダー日ではなく「直近N時間」の絶対時刻で絞り込む。
 */
export async function getChangesSince(
  db: D1Database,
  municipalityIds: string[],
  sinceISO: string,
  limit = 50,
): Promise<DailyChange[]> {
  if (municipalityIds.length === 0) return [];
  const placeholders = municipalityIds.map(() => '?').join(',');
  const r = await db
    .prepare(
      `SELECT * FROM daily_changes
       WHERE municipality_id IN (${placeholders})
         AND change_type != 'removed'
         AND detected_at >= ?
       ORDER BY detected_at DESC LIMIT ?`,
    )
    .bind(...municipalityIds, sinceISO, limit)
    .all<DailyChange>();
  return r.results ?? [];
}

export async function getRecentChanges(
  db: D1Database,
  municipalityIds: string[],
  limit = 20,
): Promise<DailyChange[]> {
  if (municipalityIds.length === 0) return [];
  const placeholders = municipalityIds.map(() => '?').join(',');
  const r = await db
    .prepare(
      `SELECT * FROM daily_changes
       WHERE municipality_id IN (${placeholders}) AND change_type != 'removed'
       ORDER BY detected_at DESC LIMIT ?`,
    )
    .bind(...municipalityIds, limit)
    .all<DailyChange>();
  return r.results ?? [];
}

export async function getArticleBySlug(db: D1Database, municipalityId: string, slug: string) {
  return await db
    .prepare('SELECT * FROM hack_articles WHERE municipality_id = ? AND slug = ?')
    .bind(municipalityId, slug)
    .first();
}

/** 遠州ハック: 有効自治体のインデックスをカテゴリ別に取得 */
export async function getEnshuIndex(db: D1Database, categoryId?: string, limit = 200) {
  if (categoryId) {
    const r = await db
      .prepare(
        `SELECT e.*, m.short_name AS muni_short FROM enshu_index e
         JOIN municipalities m ON m.id = e.municipality_id
         WHERE m.is_active = 1 AND e.normalized_category_id = ?
         ORDER BY e.updated_at DESC LIMIT ?`,
      )
      .bind(categoryId, limit)
      .all();
    return r.results ?? [];
  }
  const r = await db
    .prepare(
      `SELECT e.*, m.short_name AS muni_short FROM enshu_index e
       JOIN municipalities m ON m.id = e.municipality_id
       WHERE m.is_active = 1
       ORDER BY e.updated_at DESC LIMIT ?`,
    )
    .bind(limit)
    .all();
  return r.results ?? [];
}
