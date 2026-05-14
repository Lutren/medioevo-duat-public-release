# LOVABLE PUBLIC PORTAL v0.9 VISUAL QA

Status: PASS_VISUAL_REAL
Date: 2026-05-14
Capture method: Chrome DevTools Protocol with explicit device metrics

## Viewports

- mobile: 390x844
- tablet: 768x1024
- desktop: 1440x900

## Screenshots

| Route | Viewport | Screenshot path | Status |
|---|---|---|---|
| `/duat-city` | mobile | `qa_artifacts/screenshots/v0_9_duat_city_visual/mobile_duat-city.png` | PASS |
| `/duat-city` | tablet | `qa_artifacts/screenshots/v0_9_duat_city_visual/tablet_duat-city.png` | PASS |
| `/duat-city` | desktop | `qa_artifacts/screenshots/v0_9_duat_city_visual/desktop_duat-city.png` | PASS |
| `/landing` | mobile/tablet/desktop | `qa_artifacts/screenshots/v0_9_duat_city_visual/contact_sheet_mobile.png` | PASS regression |
| `/duat-devday` | mobile/tablet/desktop | `qa_artifacts/screenshots/v0_9_duat_city_visual/contact_sheet_tablet.png` | PASS regression |
| `/tools` | mobile/tablet/desktop | `qa_artifacts/screenshots/v0_9_duat_city_visual/contact_sheet_desktop.png` | PASS regression |

## Visual Findings

- `/duat-city`: title, notice, six district cards, Argus card and `/tools` CTA visible.
- Mobile: no horizontal overflow; content stacks into readable cards.
- Tablet: two-column district layout readable.
- Desktop: compact city shell layout readable.
- `/landing`: Simple Mode remains intact.
- `/duat-devday`: visual skin and assets remain intact.
- `/tools`: route remains intact.

## Evidence

- `qa_artifacts/screenshots/v0_9_duat_city_visual/screenshot_manifest.json`
- `qa_artifacts/screenshots/v0_9_duat_city_visual/contact_sheet_mobile.png`
- `qa_artifacts/screenshots/v0_9_duat_city_visual/contact_sheet_tablet.png`
- `qa_artifacts/screenshots/v0_9_duat_city_visual/contact_sheet_desktop.png`

## Result

Visual QA PASS with real browser screenshots. No Lovable cloud state was checked or modified.
