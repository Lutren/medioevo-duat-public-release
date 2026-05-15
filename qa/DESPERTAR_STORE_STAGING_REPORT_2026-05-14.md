# DESPERTAR Store Staging Report

Date: 2026-05-14

## Status

`READY_LOCAL_DEPLOY_GATED_BY_ACTIONGATE_BLOCK`

## Scope

This report covers the `medioevo-duat-public-release` repository, which is the current `medioevo.space` public app source observed from live HTML metadata.

## Implemented

- Added DESPERTAR as the primary public-safe book entry.
- Added `/despertar-preview` SPA route.
- Added `/despertar-preview.html` normalization to `/despertar-preview`.
- Added DESPERTAR to the Gumroad product list with URL `https://lrgonzalez.gumroad.com/l/dmqgzi`.
- Added DESPERTAR to the public books catalog and product matrix.
- Added store routes to `public/sitemap.xml`: `/store`, `/despertar-preview`, `/gumroad`, `/books`.
- Added crawlable static HTML pages: `public/store.html`, `public/despertar-preview.html`, `public/gumroad.html`, `public/books.html`.
- Updated `public/llms.txt` with the DESPERTAR public book/store boundary.
- Added `src/content/despertarStore.test.ts`.

## Public Boundary

- No full manuscripts were copied into the public repo.
- No private editorial workspace was copied into the public repo.
- No RPG/TCG files were exposed as product payload.
- No real bestseller claim was added.
- No external science claim was added.
- Gumroad integration remains direct external links only; no API/token/dashboard write.

## QA

- `npm test`: `5 passed`, `32 passed`.
- `npm run build`: PASS.
- `npm audit --audit-level=moderate`: `0 vulnerabilities`.
- `python tools\release\scan_secrets.py --path=<repo>\src --json`: `count_reported=0`.
- `python tools\release\scan_secrets.py --path=<repo>\public --json`: `count_reported=0`.
- `python tools\release\scan_secrets.py --path=<repo>\dist --json`: `count_reported=0`.
- SEO audit on `dist`: no major findings; `robots.txt`, `sitemap.xml` and `llms.txt` present.
- Local preview route smoke on port `8788`: `/`, `/store`, `/gumroad`, `/books`, `/despertar-preview`, `/despertar-preview.html`, `/sitemap.xml`, `/llms.txt` returned HTTP `200`.
- Local static route smoke on port `8788`: `/store.html`, `/despertar-preview.html`, `/gumroad.html`, `/books.html`, `/sitemap.xml`, `/llms.txt` returned HTTP `200`.
- Built asset contains `Despertar Preview`, `despertar-preview` and `dmqgzi`.
- Gumroad preflight:
  - `release_manifests/medioevo-despertar-preview.json` generated with `blocked_count=0`.
  - product secret scan `count_reported=0`.
  - release ZIP artifact secret scan `count_reported=0`.
  - path scrub `ok=true`.
  - claims scan `ok=true`.
  - dry-run ActionGate for `gumroad:dmqgzi`: `pass`.
  - real publish attempt was blocked before any API call by ActionGate decision `6f2ab2e7-8b8d-4607-aa21-e0d0196b55be`.
- Website deploy gate:
  - dry-run ActionGate for `cloudflare-pages:medioevo-site`: `pass`.
  - real deploy attempt was blocked before any Wrangler deploy by ActionGate decision `8bc78e64-33e8-471b-9760-b1ba1cffcdc4`.

## Live Check

Live `https://medioevo.space` still serves the previously deployed app:

- `https://medioevo.space/` => HTTP `200`, HTML length `2548`, no `Despertar Preview`.
- `https://medioevo.space/store` => HTTP `200`, HTML length `2548`, no `Despertar Preview`.
- `https://medioevo.space/gumroad` => HTTP `200`, HTML length `2548`, no `Despertar Preview`.
- `https://medioevo.space/books` => HTTP `200`, HTML length `2548`, no `Despertar Preview`.
- `https://medioevo.space/despertar-preview` => HTTP `200`, HTML length `2548`, no `Despertar Preview`.
- `https://medioevo.space/store.html` => HTTP `200`, HTML length `2548`, no `DESPERTAR`.
- `https://medioevo.space/despertar-preview.html` => HTTP `200`, HTML length `2548`, no `DESPERTAR`.
- `https://medioevo.space/sitemap.xml` => HTTP `200`, HTML length `2548`, no XML `urlset`.
- `https://lrgonzalez.gumroad.com/l/dmqgzi` => HTTP `200`.

Interpretation: the local repo is ready, but live deployment has not been updated.

## Host Gate

Latest target gates observed:

- Gumroad publish ActionGate: `blocked`
- Website deploy ActionGate: `blocked`
- status: `JAMMING`
- gate: `BLOCK`
- R: `0.698`
- Phi_eff: `0.353`
- memory_pct: `89.8`
- disk_pct: `95.5`
- reasons: `memoria_alta`, `disco_alto`, `residuo_alto`
- owner override: rejected for real Gumroad publish because `host not overrideable: JAMMING/BLOCK`

## Not Executed

- No Gumroad API call; real publish attempt stopped before token/API use.
- No Gumroad upload/edit/publish.
- No Cloudflare/Wrangler deploy; real deploy attempt stopped before Wrangler use.
- No GitHub push.
- No DNS change.

## Next Gate

When the host gate is no longer `BLOCK`, run:

```powershell
cd "<MEDIOEVO_WORKSPACE>\-=MEDIOEVO=-\-=LIBROS\claudio"
python tools\host_observacionista.py --no-write
```

Then, from the site repo:

```powershell
cd "<MEDIOEVO_WORKSPACE>\publish_staging\medioevo-duat-public-release"
npm test
npm run build
npm audit --audit-level=moderate
```

Deploy only if ActionGate is not `BLOCK`.
