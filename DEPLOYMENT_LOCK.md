# Production Deployment Lock

## 現在の本番の役割（2026-06-29 更新）

本番 `iwata-hack` Worker は **新ドメインへのリダイレクト主体** に役割変更済み。

- Current confirmed production Worker version: `85a2c008-4c02-4cdd-9b7a-2423e05d2ce8`
- 公開アクセス（`https://iwata-hack.hiroyukio0122.workers.dev/...`）は
  **`https://iwata.enshu-lifehack.com/...` へ 301**（`/iwata` プレフィックスは平坦化）。
- ただし `?token=<CRAWL_TOKEN>` 付きアクセスは **素通り**し、従来の動的レンダリングを返す。
  これは静的サイト再生成（`scripts/snapshot.mjs`）と `/admin/*` 管理のため。
- `scheduled()` の日次クローラー（cron `0 21 * * *`）は従来どおり継続し D1 を更新する。
- `.dev.vars` の `CRAWL_TOKEN` は本番シークレットと一致（snapshot 再生成に使用）。

## 旧・確定版（リダイレクト導入前の純・動的サイト）

- `398ef59c-3f1f-4fca-90ac-222341a8983b`
- index の life-category 手続きセクションが既定で折りたたみ、consult カードが `consult_type` 順。
- 検証: real_estate=住まい>磐田物語>介護 / nursing=介護>住まい>磐田物語 / other=磐田物語>住まい>介護
- 注意: この版に `rollback:confirmed` で戻すと **リダイレクトが解除される**（公開が再び動的サイトになる）。
  通常はリダイレクト版 `85a2c008…` を維持すること。

## 運用ルール

`npm run deploy`（通常）はブロック。意図的な本番反映は `npm run deploy:force`（= `wrangler deploy`）。

```powershell
# 意図的な新規デプロイ
npm run deploy:force

# 旧・純動的版へ戻す（=リダイレクト解除。通常は使わない）
npm run rollback:confirmed
```
