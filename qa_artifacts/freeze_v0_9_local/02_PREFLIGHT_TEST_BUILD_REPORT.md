# PREFLIGHT TEST BUILD REPORT

Date: 2026-05-14
Status: PASS
ActionGate local: APPROVE_LOCAL_FREEZE_CANDIDATE
ActionGate externo: BLOCK_PUBLIC

## Commands

- `npm test -- --run`: PASS.
- `npm run build`: PASS.
- `git diff --check`: PASS with LF/CRLF warnings only.
- `python qa_artifacts\debug_closure_v0_9\browser_debug_probe.py`: PASS.
- route smoke via local preview: PASS.

## Evidence

- Test log: `qa_artifacts/freeze_v0_9_local/02_PREFLIGHT_TEST_OUTPUT.txt`.
- Build log: `qa_artifacts/freeze_v0_9_local/02_PREFLIGHT_BUILD_OUTPUT.txt`.
- Diff check: `qa_artifacts/freeze_v0_9_local/02_PREFLIGHT_DIFF_CHECK.txt`.
- Browser probe: `qa_artifacts/freeze_v0_9_local/02_PREFLIGHT_BROWSER_PROBE.txt`.
- Route smoke: `qa_artifacts/freeze_v0_9_local/02_PREFLIGHT_ROUTE_SMOKE.json`.

## Result

- Tests: 5 files passed / 33 tests passed.
- Build: `dist/index.html`, CSS and JS generated.
- Route smoke: 24/24 routes PASS.
- Browser probe: 24 routes, 20 visual checks, 4 i18n checks, 0 failures.

No deploy, push, GitHub sync or Lovable cloud action was performed.
