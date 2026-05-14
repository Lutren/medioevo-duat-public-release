# LOVABLE PUBLIC PORTAL v0.8.1 REAL VISUAL QA

Status: PASS_VISUAL_REAL
Date: 2026-05-14
Gate: APPROVE_LOCAL for v0.8.1 repair, BLOCK for deploy/push/cloud sync

## GhostGate

- Reduces R: YES. It closes the missing real browser/mobile/tablet/desktop visual evidence.
- Reversible: YES. Changes are local CSS and documented QA artifacts.
- Secrets/private IP/deploy/auth/backend/protected routes touched: NO.
- Risk to `/duat-devday` or `/tools`: reviewed with regression screenshots and route smoke.

## Commands

- `npm install`
- `npm test -- --run`
- `npm run build`
- `npm run preview -- --host 127.0.0.1 --port 4173`

## Fix Applied

Initial real screenshot review found mobile text clipping caused by viewport/layout measurement issues. A minimal CSS containment patch was applied in `src/styles.css`:

- constrain root/header widths;
- prevent horizontal document overflow;
- force route surfaces to mobile viewport width;
- reduce mobile nav sizing;
- preserve `/duat-devday` and `/tools`.

## Evidence Matrix

| Route | Viewport | Screenshot path | Status | Finding | Fix applied | Evidence |
|---|---|---|---|---|---|---|
| `/landing` | mobile 390x844 | `qa_artifacts/screenshots/v0_8_1_real_visual/mobile_landing.png` | PASS | Simple Mode title, human copy, CTA and 3 cards visible in full-page capture. | CSS containment | No horizontal overflow in CDP manifest. |
| `/canon` | mobile 390x844 | `qa_artifacts/screenshots/v0_8_1_real_visual/mobile_canon.png` | PASS | BackButton visible, content readable. | CSS containment | No horizontal overflow in CDP manifest. |
| `/tools` | mobile 390x844 | `qa_artifacts/screenshots/v0_8_1_real_visual/mobile_tools.png` | PASS | Tools route intact. | CSS containment | No horizontal overflow in CDP manifest. |
| `/boundary` | mobile 390x844 | `qa_artifacts/screenshots/v0_8_1_real_visual/mobile_boundary.png` | PASS | Boundary route readable. | CSS containment | No horizontal overflow in CDP manifest. |
| `/handoff` | mobile 390x844 | `qa_artifacts/screenshots/v0_8_1_real_visual/mobile_handoff.png` | PASS | BackButton and Handoff v2.1 content visible. | CSS containment | No horizontal overflow in CDP manifest. |
| `/handoff-engine` | mobile 390x844 | `qa_artifacts/screenshots/v0_8_1_real_visual/mobile_handoff-engine.png` | PASS | BackButton and engine panels visible. | CSS containment | No horizontal overflow in CDP manifest. |
| `/duat-devday` | mobile 390x844 | `qa_artifacts/screenshots/v0_8_1_real_visual/mobile_duat-devday.png` | PASS | Assets visible, skin intact. | CSS containment | No horizontal overflow in CDP manifest. |
| all required routes | tablet 768x1024 | `qa_artifacts/screenshots/v0_8_1_real_visual/contact_sheet_tablet.png` | PASS | Layout readable across routes. | CSS containment | Contact sheet reviewed. |
| all required routes | desktop 1440x900 | `qa_artifacts/screenshots/v0_8_1_real_visual/contact_sheet_desktop.png` | PASS | Layout readable across routes. | CSS containment | Contact sheet reviewed. |

## Contact Sheets

- `qa_artifacts/screenshots/v0_8_1_real_visual/contact_sheet_mobile.png`
- `qa_artifacts/screenshots/v0_8_1_real_visual/contact_sheet_tablet.png`
- `qa_artifacts/screenshots/v0_8_1_real_visual/contact_sheet_desktop.png`

## Result

v0.8.1 passed build, tests, route smoke, BackButton, Simple Mode, SecretCheck, BoundaryCheck and real visual QA. v0.9 was allowed to open as a separate local patch.
