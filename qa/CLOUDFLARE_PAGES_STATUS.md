# Cloudflare Pages Status

Date: 2026-05-12 05:12:49 -06:00

## Wrangler

- Version: `4.84.1`.
- Auth status: authenticated with a local OAuth session.
- Public report policy: account email, account id and token/session details are not recorded.
- Pages permissions: available.

## Projects Observed

- `medioevo-site`
  - Domains observed: `medioevo-site.pages.dev`, `medioevo.space`, `www.medioevo.space`.
  - Selected for deploy because it was the existing project connected to the target domain.
- `medioevo`
  - Domain observed: `medioevo.pages.dev`.
  - Not selected because it was not connected to `medioevo.space` and returned HTTP 500 during preflight.

## Project Used

- Project: `medioevo-site`.
- Project created during P4: no.
- Production branch: `main`.
- Build command: `npm run build`.
- Output directory: `dist`.
- Deployment id: `dcc1df2c-d49b-40cd-b258-37a378a501f8`.
- Deployment URL: `https://dcc1df2c.medioevo-site.pages.dev`.
- Production alias: `https://medioevo-site.pages.dev`.
- Custom domain: `https://medioevo.space`.
- WWW domain: `https://www.medioevo.space`.

## Deploy Result

- `npx wrangler pages deploy dist --project-name=medioevo-site --branch=main --commit-hash=<published-commit>`: PASS.
- Uploaded files: 62.
- `_redirects`: uploaded.
- Deployment environment: Production.
- Deployment source commit: `269df96`.

## Route Smoke

All required routes returned HTTP 200 on:

- `https://dcc1df2c.medioevo-site.pages.dev`
- `https://medioevo-site.pages.dev`
- `https://medioevo.space`
- `https://www.medioevo.space`

Routes verified:

- `/`
- `/duat`
- `/telecom`
- `/handoff-hub`
- `/duat-devday`
- `/docs`

## DNS

- DNS was checked with `nslookup`.
- `medioevo.space` and `www.medioevo.space` resolved through Cloudflare.
- No DNS records were created, edited or deleted in P4.
