# Production Deployment Lock

Current confirmed production Worker version:

- `398ef59c-3f1f-4fca-90ac-222341a8983b`
- Confirmed: index life-category procedure section is collapsed by default, and consult card sorting by `consult_type` is reflected in production.
- Verification:
  - `real_estate`: 住まい > 磐田物語 > 介護
  - `nursing`: 介護 > 住まい > 磐田物語
  - `other`: 磐田物語 > 住まい > 介護

Do not run `wrangler deploy` or `npm run deploy:force` unless you intentionally want to replace this confirmed production Worker. Normal `npm run deploy` is blocked from this checkout.

Safe recovery command:

```powershell
npm run rollback:confirmed
```

Intentional new deployment command:

```powershell
npm run deploy:force
```
