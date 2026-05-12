# Monitoring Light Checklist

No cron, paid monitoring, or external monitoring service is required for P6.

## Daily / Weekly Manual Checks

- Visit [https://medioevo.space](https://medioevo.space).
- Verify SSL works without browser warnings.
- Check required routes:
  - `/`
  - `/duat`
  - `/telecom`
  - `/handoff-hub`
  - `/duat-devday`
  - `/docs`
- Check GitHub issues for public bug reports or docs feedback.
- Check the latest Cloudflare Pages deployment in the `medioevo-site` project.

## Local Maintenance Checks

```bash
npm test
npm run build
npm audit --audit-level=moderate
```

Run the focused secret scan before any release, tag, deploy, or public announcement.

## Boundary Checks

- No private canon.
- No `.env` files.
- No credentials, tokens, cookies, or service accounts.
- No internal ZIPs or source vaults.
- No local logs or local operator paths.
- No unsupported claims.
