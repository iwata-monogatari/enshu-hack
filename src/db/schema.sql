-- ============================================================
-- 磐田ハック / 遠州ハック構想対応 D1 スキーマ v1.1
-- マルチ自治体対応。磐田専用に固定しない設計。
-- ============================================================

-- ----- 自治体マスタ ------------------------------------------
CREATE TABLE IF NOT EXISTS municipalities (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  short_name        TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  official_base_url TEXT NOT NULL,
  sitemap_url       TEXT,
  region            TEXT,
  is_active         INTEGER DEFAULT 0,
  display_order     INTEGER
);

-- ----- 公式ページ一覧 ----------------------------------------
-- D判定は保存しない。C以上のみ保存する。
CREATE TABLE IF NOT EXISTS official_pages (
  id                  TEXT PRIMARY KEY,
  municipality_id     TEXT NOT NULL,
  official_url        TEXT NOT NULL,
  title               TEXT NOT NULL,
  category            TEXT,            -- 共通カテゴリID (categories.id)
  subcategory         TEXT,            -- 公式サイト側の細目（パス等）
  page_type           TEXT,
  priority            TEXT,            -- 'A+' | 'A' | 'B' | 'C'
  official_updated_at TEXT,
  first_seen_at       TEXT,
  last_checked_at     TEXT,
  content_hash        TEXT,
  article_status      TEXT,            -- 'pending' | 'generated' | 'link_only' | NULL
  is_public           INTEGER DEFAULT 1,
  FOREIGN KEY (municipality_id) REFERENCES municipalities(id),
  UNIQUE (municipality_id, official_url)
);
CREATE INDEX IF NOT EXISTS idx_pages_muni      ON official_pages (municipality_id);
CREATE INDEX IF NOT EXISTS idx_pages_category  ON official_pages (municipality_id, category);
CREATE INDEX IF NOT EXISTS idx_pages_priority  ON official_pages (municipality_id, priority);

-- ----- 毎日の差分ログ ----------------------------------------
CREATE TABLE IF NOT EXISTS daily_changes (
  id                   TEXT PRIMARY KEY,
  municipality_id      TEXT NOT NULL,
  official_page_id     TEXT,
  detected_at          TEXT NOT NULL,
  change_type          TEXT NOT NULL,  -- added|updated|removed|title_changed|category_changed
  previous_hash        TEXT,
  current_hash         TEXT,
  title_snapshot       TEXT,
  official_url_snapshot TEXT,
  priority_snapshot    TEXT,
  FOREIGN KEY (municipality_id) REFERENCES municipalities(id),
  FOREIGN KEY (official_page_id) REFERENCES official_pages(id)
);
CREATE INDEX IF NOT EXISTS idx_changes_muni_date ON daily_changes (municipality_id, detected_at);

-- ----- 各自治体ハックの記事 ----------------------------------
CREATE TABLE IF NOT EXISTS hack_articles (
  id               TEXT PRIMARY KEY,
  municipality_id  TEXT NOT NULL,
  official_page_id TEXT NOT NULL,
  slug             TEXT NOT NULL,
  title            TEXT NOT NULL,
  summary          TEXT,
  body             TEXT,
  status           TEXT,              -- 'pending' | 'published'
  generated_level  TEXT,              -- detailed|medium|short|link_only
  last_generated   TEXT,
  published_at     TEXT,
  FOREIGN KEY (municipality_id) REFERENCES municipalities(id),
  FOREIGN KEY (official_page_id) REFERENCES official_pages(id),
  UNIQUE (municipality_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_articles_muni ON hack_articles (municipality_id);

-- ----- 全自治体共通カテゴリ ----------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  priority        TEXT,
  display_order   INTEGER,
  is_core         INTEGER DEFAULT 0
);

-- ----- 自治体別カテゴリ変換 ----------------------------------
-- 公式サイトのカテゴリ名（パス接頭辞）を共通カテゴリへ変換する。
CREATE TABLE IF NOT EXISTS category_mappings (
  id                     TEXT PRIMARY KEY,
  municipality_id        TEXT NOT NULL,
  official_category_name TEXT NOT NULL,  -- 公式パス接頭辞 or カテゴリ名
  normalized_category_id TEXT NOT NULL,
  priority               TEXT,
  FOREIGN KEY (municipality_id) REFERENCES municipalities(id),
  FOREIGN KEY (normalized_category_id) REFERENCES categories(id),
  UNIQUE (municipality_id, official_category_name)
);

-- ----- 遠州ハック統合インデックス ----------------------------
CREATE TABLE IF NOT EXISTS enshu_index (
  id                     TEXT PRIMARY KEY,
  municipality_id        TEXT NOT NULL,
  official_page_id       TEXT,
  hack_article_id        TEXT,
  normalized_category_id TEXT,
  title                  TEXT NOT NULL,
  summary                TEXT,
  url                    TEXT NOT NULL,
  priority               TEXT,
  updated_at             TEXT,
  FOREIGN KEY (municipality_id) REFERENCES municipalities(id),
  FOREIGN KEY (official_page_id) REFERENCES official_pages(id),
  FOREIGN KEY (hack_article_id) REFERENCES hack_articles(id),
  FOREIGN KEY (normalized_category_id) REFERENCES categories(id),
  UNIQUE (municipality_id, url)
);
CREATE INDEX IF NOT EXISTS idx_enshu_cat ON enshu_index (normalized_category_id);

-- ============================================================
-- スマホファースト v1.0 追加: 困りごと中心のデータ構造（改修版）
-- ============================================================

-- ----- 1. life_categories -----
CREATE TABLE IF NOT EXISTS life_categories (
  id TEXT PRIMARY KEY,
  municipality_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  icon TEXT,
  display_order INTEGER,
  is_featured INTEGER DEFAULT 0,
  created_at TEXT,
  updated_at TEXT,
  UNIQUE (municipality_id, slug)
);

-- ----- 2. life_topics -----
CREATE TABLE IF NOT EXISTS life_topics (
  id TEXT PRIMARY KEY,
  municipality_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  icon TEXT,
  summary TEXT,
  display_order INTEGER,
  rank TEXT,
  status TEXT DEFAULT 'draft',
  consult_type TEXT NOT NULL DEFAULT 'other',
  created_at TEXT,
  updated_at TEXT,
  UNIQUE (municipality_id, slug)
);

-- ----- 3. trouble_guides -----
CREATE TABLE IF NOT EXISTS trouble_guides (
  id TEXT PRIMARY KEY,
  municipality_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  who_needs_this TEXT,
  first_action TEXT,
  today_tasks TEXT,
  this_week_tasks TEXT,
  later_tasks TEXT,
  required_items TEXT,
  municipal_window TEXT,
  outside_agencies TEXT,
  caution TEXT,
  official_sources TEXT,
  last_verified_at TEXT,
  status TEXT DEFAULT 'draft',
  created_at TEXT,
  updated_at TEXT,
  UNIQUE (municipality_id, slug)
);

-- ----- 4. procedure_steps -----
CREATE TABLE IF NOT EXISTS procedure_steps (
  id TEXT PRIMARY KEY,
  trouble_guide_id TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  timing TEXT,
  task_name TEXT NOT NULL,
  deadline TEXT,
  window_name TEXT,
  required_items TEXT,
  official_page_id TEXT,
  outside_agency TEXT,
  is_municipal INTEGER DEFAULT 1,
  note TEXT
);

-- ----- 5. feedback_logs -----
CREATE TABLE IF NOT EXISTS feedback_logs (
  id TEXT PRIMARY KEY,
  municipality_id TEXT NOT NULL,
  trouble_guide_id TEXT,
  feedback_type TEXT NOT NULL,
  freeword TEXT,
  created_at TEXT
);
