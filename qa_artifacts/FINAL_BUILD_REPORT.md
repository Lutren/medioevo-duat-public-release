# FINAL_BUILD_REPORT

Status: PASS
Fingerprint: MDV-LOVABLE-PUBLIC-PORTAL-v0.9
Date: 2026-05-14

## Commands

- `npm test -- --run`: PASS.
- `npm run build`: PASS.

## Evidence

Tests:

- 5 test files passed.
- 33 tests passed.

Build output:

- `dist/index.html` generated.
- `dist/assets/index-aiJkcohr.css` generated, 20.66 kB.
- `dist/assets/index-jFxas3oC.js` generated, 260.28 kB.

Debug closure evidence:

- final test log: `qa_artifacts/debug_closure_v0_9/01_TEST_OUTPUT_FINAL_POST_REPORTS.txt`.
- final build log: `qa_artifacts/debug_closure_v0_9/02_BUILD_OUTPUT_FINAL_POST_REPORTS.txt`.
- final diff check: `qa_artifacts/debug_closure_v0_9/00_DIFF_CHECK_FINAL_POST_REPORTS.txt`.

## Scope

This closes the local v0.9 `/duat-city` debug pass after real visual QA and accessibility/i18n stabilization. No deploy, push, GitHub sync or Lovable cloud change was performed.
