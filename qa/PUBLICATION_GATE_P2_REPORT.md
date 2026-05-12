# Publication Gate P2 Report

Date: 2026-05-12

## Initial State

- Initial commit detected: `eced76c`
- Branch: `main`
- Remote: none configured
- Release root: `publish_staging/medioevo-duat-public-release`

## Files Modified

- `.gitignore`
- `src/App.tsx`
- `src/styles.css`
- `src/styles/duat-display.css`
- `src/messagebus/seed.ts`
- `src/content/devday/DEV_DAY_SUBMISSION_TEXT_EN.md`
- `src/content/devday/STYLE_GUIDE_DUAT_DISPLAY.md`
- `docs/PUBLIC_README.md`
- `docs/PUBLIC_SCOPE.md`
- `docs/TELECOM_CORE_OVERVIEW.md`
- `docs/DEV_DAY_SUBMISSION_TEXT_EN.md`
- `qa/ASSET_INTEGRATION_REPORT.md`
- `qa/REPO_REMOTE_PREFLIGHT.md`
- `qa/DEPLOY_PREFLIGHT.md`
- `qa/NEXT_OPERATOR_DECISION.md`
- `qa/PUBLICATION_GATE_P2_REPORT.md`

## Assets Integrated

- DUAT brand assets: logo mark, wordmark and badge.
- DUAT icons: 13 SVG and 13 PNG feature icons.
- DUAT UI modules: 6 SVG and 6 PNG panels.
- DUAT backgrounds: 2 SVG and 2 PNG backgrounds.
- DUAT posters: 3 SVG and 4 PNG posters.
- Public submission text: `DEV_DAY_SUBMISSION_TEXT_EN.md`.
- Public style guide: `STYLE_GUIDE_DUAT_DISPLAY.md`.

## Assets Omitted

- Original ZIP: not copied into public source.
- `prompts/`: omitted because prompt packs may contain non-public operating strategy.
- `lovable_patch/`: not copied raw; instructions were read and adapted into the existing app.
- `previews/`: omitted from public app because it is a review/contact-sheet artifact, not required at runtime.
- `ASSET_MANIFEST.json`: omitted because the release reports provide the publication manifest.
- `qa/asset_review/`: extracted for review only and ignored by Git.

## Routes Verified

Local Vite server: `http://127.0.0.1:5179/`

- `/` -> HTTP 200
- `/duat` -> HTTP 200
- `/telecom` -> HTTP 200
- `/handoff-hub` -> HTTP 200
- `/duat-devday` -> HTTP 200
- `/docs` -> HTTP 200

Asset routes:

- `/duat-assets/posters/png/duat-display-concept-generated.png` -> HTTP 200
- `/duat-assets/posters/png/duat-devday-hero.png` -> HTTP 200
- `/duat-assets/posters/png/duat-social-card.png` -> HTTP 200
- `/duat-assets/brand/duat-logo-mark.svg` -> HTTP 200
- `/duat-assets/brand/duat-wordmark.svg` -> HTTP 200

## QA Results

- `npm test`: PASS, 2 files, 15 tests.
- `npm run build`: PASS, Vite 8.0.12 production build.
- `npm audit --audit-level=moderate`: PASS, 0 vulnerabilities.
- `python tools/release/scan_secrets.py --path=<public-release>`: PASS, `reported findings: 0`.
- Blocked filename scan: PASS, 0.
- Token/provider marker scan: PASS for real findings. It found only expected policy markers in denylist documentation and `.gitignore`.
- Key asset signature check: PASS for PNG/SVG runtime assets.

## Blockers

No publication blockers were found in the local release candidate.

External push and deploy remain gated until the operator confirms repository, deploy platform and authorization.

## Recommendation

READY_FOR_PUSH

Condition: ready for push only after operator confirms the final GitHub repository and authorizes external publication. No push or deploy was executed in P2.
