-- ============================================================
-- 磐田ハック 初期データ v1.1
-- ============================================================

-- ----- 自治体マスタ ------------------------------------------
-- 磐田のみ is_active=1。他は将来有効化（DB・コードは対応済み）。
INSERT OR REPLACE INTO municipalities
  (id, name, short_name, slug, official_base_url, sitemap_url, region, is_active, display_order) VALUES
  ('iwata',     '磐田市', '磐田',   'iwata',     'https://www.city.iwata.shizuoka.jp/',   'https://www.city.iwata.shizuoka.jp/sitemap.html', '遠州', 1, 1),
  ('fukuroi',   '袋井市', '袋井',   'fukuroi',   'https://www.city.fukuroi.shizuoka.jp/', NULL, '遠州', 0, 2),
  ('kakegawa',  '掛川市', '掛川',   'kakegawa',  'https://www.city.kakegawa.shizuoka.jp/',NULL, '遠州', 0, 3),
  ('mori',      '森町',   '森町',   'mori',      'https://www.town.morimachi.shizuoka.jp/',NULL,'遠州', 0, 4),
  ('hamamatsu', '浜松市', '浜松',   'hamamatsu', 'https://www.city.hamamatsu.shizuoka.jp/',NULL,'遠州', 0, 5);

-- ----- 共通カテゴリ ------------------------------------------
INSERT OR REPLACE INTO categories
  (id, name, normalized_name, priority, display_order, is_core) VALUES
  ('kurashi',   'くらし・手続き',   'kurashi',   'A+', 1, 1),
  ('bousai',    '防災・安全',       'bousai',    'A+', 2, 1),
  ('shisetsu',  '施設ガイド',       'shisetsu',  'A+', 3, 1),
  ('kosodate',  '子育て・教育',     'kosodate',  'A+', 4, 1),
  ('fukushi',   '健康・福祉・介護', 'fukushi',   'A+', 5, 1),
  ('sangyou',   '産業・ビジネス',   'sangyou',   'A',  6, 0),
  ('event',     'イベント',         'event',     'A',  7, 0),
  ('saiyou',    '職員採用',         'saiyou',    'B',  8, 0),
  ('shingikai', '審議会・会議録',   'shingikai', 'B',  9, 0),
  ('shisei',    '市政情報',         'shisei',    'B', 10, 0);

-- ----- 磐田市カテゴリ変換 ------------------------------------
-- official_category_name は磐田市公式サイトのパス接頭辞。
INSERT OR REPLACE INTO category_mappings
  (id, municipality_id, official_category_name, normalized_category_id, priority) VALUES
  ('iwata-bousai',   'iwata', 'bousai_anzen',              'bousai',    'A+'),
  ('iwata-kurashi',  'iwata', 'kurashi_tetsuzuki',         'kurashi',   'A+'),
  ('iwata-gomi',     'iwata', 'kurashi_tetsuzuki/gomi_recycle', 'kurashi', 'A+'),
  ('iwata-kosodate', 'iwata', 'kosodate_kyouiku',          'kosodate',  'A+'),
  ('iwata-fukushi',  'iwata', 'kenkou_fukushi',            'fukushi',   'A+'),
  ('iwata-kaigo',    'iwata', 'kenkou_fukushi/kaigohoken', 'fukushi',   'A+'),
  ('iwata-sports',   'iwata', 'sports_midokoro',           'event',     'A'),
  ('iwata-sangyou',  'iwata', 'sangyou_business',          'sangyou',   'A'),
  ('iwata-saiyou',   'iwata', 'shiseijouhou/shokuin_saiyou','saiyou',   'B'),
  ('iwata-shingikai','iwata', 'shigikai',                  'shingikai', 'B'),
  ('iwata-shisei',   'iwata', 'shiseijouhou',              'shisei',    'B');
-- 注: shichounoheya（市長の部屋）は意図的にマッピングしない → D判定で除外。
