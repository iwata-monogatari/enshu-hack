console.error('DEPLOY BLOCKED: production is pinned to Cloudflare Worker version a9392f1e-f9ce-4f21-98cf-9e305e95058a.');
console.error('Local source is older than the active production Worker. Do not run wrangler deploy from this checkout.');
console.error('To restore production, run: npm run rollback:confirmed');
process.exit(1);
