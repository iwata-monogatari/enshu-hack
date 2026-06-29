# 磐田ハック（iwata-hack）

遠州ハック構想に対応した、**マルチ自治体対応の地域情報サイト**です。
各自治体の公式ホームページを出発点に、市民が必要な情報へ素早くたどり着けるよう、公式情報を整理・分類し、最終的に必ず公式ページへ案内します（公式情報の転載サイトではありません）。

- 初期公開：**磐田ハック**
- 将来展開：袋井・掛川・森町・浜松ハック、統合ポータル「遠州ハック」
- スタック：**Cloudflare Workers + D1**（TypeScript）

運営：富士ヶ丘サービス ／ 代表：大石浩之

---

## 構成

```
iwata-hack/
  ├── src/
  │   ├── index.ts            … Worker エントリ（ルータ + 日次cron）
  │   ├── types.ts            … 共通型
  │   ├── config.ts           … 優先順位ルール / D除外ルール
  │   ├── util.ts             … ハッシュ・slug・日付・エスケープ
  │   ├── routes/             … municipality / category / article / enshu
  │   ├── crawler/            … fetchSitemap / parsePage / classifyPriority / detectChanges / runCrawl
  │   ├── db/                 … schema.sql / seed.sql / queries.ts
  │   └── views/              … layout / top / category / article / enshu
  ├── public/                 … robots.txt / favicon.svg
  ├── wrangler.toml
  └── package.json
```

## DBテーブル（D1）

`municipalities` / `official_pages` / `daily_changes` / `hack_articles` / `categories` / `category_mappings` / `enshu_index`

> 設計書では6テーブルですが、自治体ごとのカテゴリ名揺れを吸収するため **`category_mappings`** を加えた7テーブル構成です。磐田専用に固定しない設計のため、将来の自治体追加は seed への行追加のみで対応できます。

## 優先順位ルール

| 優先度 | 扱い |
|---|---|
| A+ | くらし・手続き / 防災・安全 / 施設ガイド / 子育て・教育 / 健康・福祉・介護 → 詳細記事 |
| A | 市民生活に重要なその他 → 中記事 |
| B | 職員採用 / 審議会 / 会議録 等 → 短記事 |
| C | 公式リンクカードのみ（独自解説なし）。DBには保存する |
| D | **DBに入れない・公開しない・リンクもしない**（市長の部屋 等） |

磐田市の実パス → 共通カテゴリの対応は `src/db/seed.sql` の `category_mappings`、
コード側フォールバックは `src/config.ts` を参照。

---

## セットアップ手順

> Node.js / npm が必要です。未インストールの場合は https://nodejs.org からインストールしてください。

```bash
cd iwata-hack
npm install

# 1. D1 データベース作成（出力された database_id を wrangler.toml に貼り付け）
npm run db:create

# 2. スキーマ & 初期データ投入（ローカル）
npm run db:schema:local
npm run db:seed:local

# 3. ローカル起動
npm run dev
#   → http://localhost:8787/            （磐田ハック トップ）
#   → http://localhost:8787/iwata/category/bousai/
#   → http://localhost:8787/enshu/

# 4. 初回クロール（ローカル dev 起動中に別ターミナルで）
#    CRAWL_TOKEN は wrangler.toml の [vars] 既定値
curl "http://localhost:8787/admin/crawl?token=change-me-in-production&muni=iwata"
```

### 本番デプロイ

```bash
npm run db:schema      # 本番D1へスキーマ
npm run db:seed        # 本番D1へ初期データ
npm run deploy         # Workers へデプロイ

# 本番では CRAWL_TOKEN を secret に
wrangler secret put CRAWL_TOKEN
```

日次クロールは `wrangler.toml` の cron（`0 21 * * *` = 06:00 JST）で自動実行されます。

---

## ルーティング

| パス | 内容 |
|---|---|
| `/` | 既定自治体（磐田）トップ＝本日の更新 + カテゴリ |
| `/iwata/` | 磐田ハック トップ |
| `/iwata/category/:categoryId/` | カテゴリ一覧（A+/A/B=記事リンク、C=公式リンクカード） |
| `/iwata/article/:slug/` | 記事ページ（A+/A/B） |
| `/enshu/` | 遠州ハック統合トップ |
| `/enshu/:categoryId/` | 遠州カテゴリ横断 |
| `/admin/crawl?token=…&muni=iwata` | 手動クロール（JSONレポート） |
| `/sitemap.xml` | 動的サイトマップ |

---

## 将来の自治体追加（例：袋井）

1. `municipalities` の `fukuroi` を `is_active=1`、`official_base_url` を確定
2. `category_mappings` に袋井の公式パス → 共通カテゴリ行を追加
3. クロールが走れば `/fukuroi/` と `/enshu/`（統合）へ自動反映

DB構造・表示ロジックの作り直しは不要です。

## 営業導線・免責

- 営業導線は **介護・福祉（地域包括支援センター関連を含む）に限定**。不動産導線は初期実装では入れません。
- 全ページ共通で非公式・免責バナーを表示します。
