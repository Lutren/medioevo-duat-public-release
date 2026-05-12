# Deploy P4 Report

Date: 2026-05-12 05:12:49 -06:00

## Source

- Repo: `https://github.com/Lutren/medioevo-duat-public-release`
- Local path: `publish_staging/medioevo-duat-public-release`
- Branch: `main`
- Commit used: `269df962bcbdd1537cf27435ab29e9635155cf17`
- Remote verified: `https://github.com/Lutren/medioevo-duat-public-release.git`

## Pre-Deploy QA

- `npm install`: PASS, dependencies up to date.
- `npm test`: PASS, 2 test files, 15 tests.
- `npm run build`: PASS, Vite 8.0.12, output in `dist/`.
- `npm audit --audit-level=moderate`: PASS, 0 vulnerabilities.
- Secret scan: PASS, `reported findings: 0`.
- Blocked tracked filenames: PASS, 0.
- Tracked repo size: 9.08 MB.
- Files larger than 25 MB: 0.
- Files larger than 100 MB: 0.

## Platform Detection

- Cloudflare Pages/Wrangler: available and authenticated.
- Wrangler version: `4.84.1`.
- GitHub CLI: authenticated for the repo owner.
- Vercel CLI: available, not used.
- Netlify CLI: available, not used.
- Local deploy config files: no `wrangler.toml`, no `vercel.json`, no `netlify.toml`.

## Deploy

- Platform used: Cloudflare Pages.
- Existing Pages project used: `medioevo-site`.
- Project created: no.
- Build command used locally before deploy: `npm run build`.
- Output directory deployed: `dist`.
- Branch: `main`.
- Deploy command: `npx wrangler pages deploy dist --project-name=medioevo-site --branch=main --commit-hash=<published-commit>`.
- Deployment id: `dcc1df2c-d49b-40cd-b258-37a378a501f8`.
- Deployment URL: `https://dcc1df2c.medioevo-site.pages.dev`.
- Production alias: `https://medioevo-site.pages.dev`.
- Custom domain verified: `https://medioevo.space`.
- WWW custom domain verified: `https://www.medioevo.space`.
- Deploy executed: yes.

## Route Smoke

Verified HTTP 200:

- `https://dcc1df2c.medioevo-site.pages.dev/`
- `https://dcc1df2c.medioevo-site.pages.dev/duat`
- `https://dcc1df2c.medioevo-site.pages.dev/telecom`
- `https://dcc1df2c.medioevo-site.pages.dev/handoff-hub`
- `https://dcc1df2c.medioevo-site.pages.dev/duat-devday`
- `https://dcc1df2c.medioevo-site.pages.dev/docs`
- `https://medioevo-site.pages.dev/`
- `https://medioevo-site.pages.dev/duat`
- `https://medioevo-site.pages.dev/telecom`
- `https://medioevo-site.pages.dev/handoff-hub`
- `https://medioevo-site.pages.dev/duat-devday`
- `https://medioevo-site.pages.dev/docs`
- `https://medioevo.space/`
- `https://medioevo.space/duat`
- `https://medioevo.space/telecom`
- `https://medioevo.space/handoff-hub`
- `https://medioevo.space/duat-devday`
- `https://medioevo.space/docs`
- `https://www.medioevo.space/`
- `https://www.medioevo.space/duat`
- `https://www.medioevo.space/telecom`
- `https://www.medioevo.space/handoff-hub`
- `https://www.medioevo.space/duat-devday`
- `https://www.medioevo.space/docs`

## Domain State

- `medioevo.space`: connected before P4 and verified after deploy.
- `www.medioevo.space`: connected before P4 and verified after deploy.
- DNS lookup: resolved through Cloudflare.
- DNS changes made: none.
- Nameserver changes made: none.
- MX/TXT/CNAME/A record changes made: none.

## Blockers

None for P4 deploy.

## Next Action

Run P5 Domain Finalization to verify SSL/canonical routing, create a release tag, and prepare publication text. Do not touch private canon.
