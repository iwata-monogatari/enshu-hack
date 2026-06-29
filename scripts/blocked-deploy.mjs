console.error('DEPLOY BLOCKED: production is pinned to Cloudflare Worker version 398ef59c-3f1f-4fca-90ac-222341a8983b.');
console.error('Do not run wrangler deploy unless you intentionally want to replace the confirmed production Worker.');
console.error('To restore production, run: npm run rollback:confirmed');
process.exit(1);
