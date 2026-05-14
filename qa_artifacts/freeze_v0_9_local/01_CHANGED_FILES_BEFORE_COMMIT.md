# CHANGED FILES BEFORE COMMIT

Date: 2026-05-14
Scope: DUAT v0.9 local freeze only
ActionGate: local freeze allowed; external publication blocked

## Commit Scope

| path | tipo de cambio | razon funcional | riesgo | evidencia QA relacionada |
|---|---|---|---|---|
| `src/App.tsx` | modified | v0.9 public `/duat-city` shell, basic EN/ES/RU/ZH selector, accessible Command Console and explicit labels. | LOW_LOCAL | tests/build/routes/visual/a11y/i18n PASS in `qa_artifacts/debug_closure_v0_9/` |
| `src/styles.css` | modified | Styles for language selector, command shell and responsive local review surface. | LOW_LOCAL | build/visual PASS in `qa_artifacts/debug_closure_v0_9/` |
| `qa_artifacts/` | new/updated | Reproducible QA evidence, freeze snapshot, final reports and human review packet. | LOW_LOCAL | tests/build/route/secret/boundary reports |

## Not In Commit Scope

The repository has pre-existing unrelated dirty files outside this freeze lane, captured in `00_GIT_STATUS_BEFORE_COMMIT.txt`. They are not part of this commit because this run is path-scoped to `src/App.tsx`, `src/styles.css` and `qa_artifacts/`.

No deploy, push, GitHub sync or Lovable cloud action is authorized by this manifest.
