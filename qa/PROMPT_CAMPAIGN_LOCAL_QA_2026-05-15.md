# PROMPT CAMPAIGN LOCAL QA - 2026-05-15

## Scope

Implementation and verification for the MEDIOEVO / DUAT prompt campaign and short book lead magnet.

External actions were rechecked on 2026-05-15. The operator explicitly authorized Git push for the public repo after local QA and secret gates. Gumroad and social posting remain gated separately.

## Implemented Surface

- Free prompt package:
  - `public/prompts/01_scanner_seguridad_local.md`
  - `public/prompts/02_ahorro_tokens_extremo.md`
  - `public/prompts/03_handoff_memoria_persistente.md`
- Short public-safe manuscript:
  - `public/books/medioevo-informacion-residuo-observacion.md`
- Public routes and static crawlable fallbacks:
  - `/prompts`
  - `/blog`
  - `/blog/prompts-definitivos`
- React content registry:
  - `src/content/promptCampaign.ts`
  - `src/content/promptCampaign.test.ts`
- Site integration:
  - Home community block with three prompts, short-book CTA and DUAT link.
  - DUAT field unlock panel and public-safe "where this goes" panel.
  - Sitemap, redirects and `llms.txt` updated for prompt/book discovery.

## Verification

| Check | Result |
| --- | --- |
| Pending snapshot | `pending_review date=2026-05-15 active_dedup=11 claudio_open=0` |
| Git branch | `public-identity-ai-discovery` |
| Git remote | `origin https://github.com/Lutren/medioevo-duat-public-release.git` |
| Tests | `npm test` -> 10 files passed, 44 tests passed |
| Build | `npm run build` -> PASS |
| Dependency audit | `npm audit --audit-level=moderate` -> 0 vulnerabilities |
| Public release audit | `python scripts\release_audit_public.py` -> `status=PASS`, `package_files=162`, `secret_block=false`, `reconstruction=true` |
| Focused workspace secret scan | `python tools\release\scan_secrets.py --path "publish_staging\medioevo-duat-public-release" --json --fail-on-findings` -> `count_reported=0` |
| SEO audit on `dist` | No major findings; sitemap fragment URLs `0`; `company_md_present=MISSING` only |
| Focused credential scan | No credential-shaped matches in `src` or `public` |
| Prompt/book boundary scan | Only benign policy mentions about not printing secrets/tokens/env files |
| Sitemap parser | 30 URLs, required prompt/book/blog URLs present, fragments `0` |
| Local route smoke | HTTP 200 for `/`, `/duat`, `/blog`, `/blog/prompts-definitivos`, `/prompts`, prompt files, short book, `/sitemap.xml`, `/llms.txt` |
| Preview | `http://127.0.0.1:8791`, listener PID `40708` |
| Host gate | `status=MIXTO`, `gate=REVIEW`, `R=0.469`, `Phi_eff=0.497`, reasons `disco_precaucion`, `residuo_precaucion` |

## Visual Evidence

- `qa/screenshots/prompt-campaign-2026-05-15/home-desktop.png`
- `qa/screenshots/prompt-campaign-2026-05-15/prompts-mobile.png`
- `qa/screenshots/prompt-campaign-2026-05-15/blog-desktop.png`
- `qa/screenshots/prompt-campaign-2026-05-15/duat-desktop.png`

## ActionGate

- Local content/build/test/QA: APPROVE.
- Public release audit: APPROVE.
- Host/external actions: REVIEW due host pressure.
- Git push: REVIEW overridden by explicit operator authorization for this public repo only after tests, build, audit and secret scan passed.
- Cloudflare static deploy: REVIEW pending final deploy command and live verification.
- Gumroad/social: BLOCK until target-specific gate is rechecked and approved.

## Next Verifiable Action

Commit, push and deploy the public prompt/blog surface, then verify `https://medioevo.space/blog` and `https://medioevo.space/prompts` by content, not only HTTP 200.
