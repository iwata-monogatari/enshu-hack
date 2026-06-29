# Production Deployment Lock

Current confirmed production Worker version:

- `a9392f1e-f9ce-4f21-98cf-9e305e95058a`
- Created: `2026-06-29T11:50:45.139Z` (`2026-06-29 20:50:45 JST`)
- Rollback deployment message: `Restore pre-Codex Antigravity deployment`

Do not run `wrangler deploy` or `npm run deploy` from this checkout unless the local source has first been reconciled with the confirmed production Worker. The local repository does not contain the exact source bundle for the active production Worker.

Safe recovery command:

```powershell
npm run rollback:confirmed
```

Intentional new deployment command, only after source reconciliation:

```powershell
npm run deploy:force
```
