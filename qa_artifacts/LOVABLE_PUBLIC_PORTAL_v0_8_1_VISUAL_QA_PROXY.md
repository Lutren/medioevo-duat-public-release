# LOVABLE_PUBLIC_PORTAL_v0_8_1_VISUAL_QA_PROXY

Status: PASS_LOCAL_PROXY
Fingerprint: MDV-LOVABLE-PUBLIC-PORTAL-v0.8.1-REPAIRED

## Why Proxy

No local headless browser command was available in PATH and the in-app browser control tool was not exposed in this session. Therefore this report uses local proxy evidence: route smoke, build, tests, CSS responsive rules and static DOM/source proof.

## Visual/UX Static Proof

- `/landing` route exists.
- `/landing` contains `data-testid="simple-mode-landing"`.
- `/landing` contains Simple Mode title and human-facing copy.
- `/landing` contains a primary CTA to `/tools`.
- `/landing` contains exactly 3 `.simple-card` cards.
- `/landing` contains an advanced details toggle with `aria-expanded` and `aria-controls`.
- `BackButton` exists as a reusable component.
- `BackButton` usage count: 5.
- `BackButton` appears on `/canon`, `/tools`, `/boundary`, `/handoff` and `/handoff-engine`.
- `BackButton` does not appear inside `LandingRoute`.
- Responsive CSS includes grid collapse under `1040px` and `720px`, including `.simple-mode-panel` and `.simple-card-grid`.

## Route Smoke

- `/landing`: PASS.
- `/canon`: PASS.
- `/tools`: PASS.
- `/boundary`: PASS.
- `/handoff`: PASS.
- `/handoff-engine`: PASS.
- `/duat-devday`: PASS.

## Asset Smoke

- `/duat-assets/brand/duat-logo-mark.svg`: HTTP 200.
- `/duat-assets/brand/duat-wordmark.svg`: HTTP 200.
- `/duat-assets/posters/png/duat-devday-hero.png`: HTTP 200.

## Result

v0.8.1 visual QA proxy: PASS.
Manual visual review is still useful before any external sync/deploy.
