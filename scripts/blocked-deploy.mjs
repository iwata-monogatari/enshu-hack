console.error('DEPLOY BLOCKED: production is pinned to Cloudflare Worker version 5ab901ac-fe25-4c0b-9d65-3bc1550cc825.');
console.error('Do not run wrangler deploy unless you intentionally want to replace the confirmed production Worker.');
console.error('To restore production, run: npm run rollback:confirmed');
process.exit(1);
