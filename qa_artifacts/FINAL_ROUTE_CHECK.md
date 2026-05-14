# FINAL_ROUTE_CHECK

Status: PASS
Fingerprint: MDV-LOVABLE-PUBLIC-PORTAL-v0.9
Date: 2026-05-14

Preview server used for smoke check: `http://127.0.0.1:4173`

| route | HTTP | SPA shell mounted | result |
|---|---:|---:|---|
| `/` | 200 | true | PASS |
| `/landing` | 200 | true | PASS |
| `/about` | 200 | static public page | PASS |
| `/books` | 200 | static public page | PASS |
| `/store` | 200 | static public page | PASS |
| `/despertar-preview` | 200 | static public page | PASS |
| `/despertar-preview.html` | 200 | static public page | PASS |
| `/gumroad` | 200 | static public page | PASS |
| `/products` | 200 | true | PASS |
| `/audit` | 200 | true | PASS |
| `/commercial-audit` | 200 | true | PASS |
| `/status` | 200 | true | PASS |
| `/canon` | 200 | true | PASS |
| `/tools` | 200 | true | PASS |
| `/boundary` | 200 | true | PASS |
| `/duat` | 200 | true | PASS |
| `/telecom` | 200 | true | PASS |
| `/teleco` | 200 | true | PASS |
| `/handoff` | 200 | true | PASS |
| `/handoff-hub` | 200 | true | PASS |
| `/handoff-engine` | 200 | true | PASS |
| `/duat-devday` | 200 | true | PASS |
| `/duat-city` | 200 | true | PASS |
| `/docs` | 200 | true | PASS |

## DOM Proof

`/duat-city` is present in `ROUTE_PATHS`, has navigation label `City`, renders a BackButton, public-safe notice, six `PUBLIC_DEMO` district cards, Argus Firewall card, Command Console shell, language selector and `/tools` CTA.

Final evidence:

- `qa_artifacts/debug_closure_v0_9/03_ROUTE_SMOKE_FINAL_POST_REPORTS.json`.
- `qa_artifacts/debug_closure_v0_9/browser_debug_probe.json`.

## Result

v0.9 route check: PASS, 24/24 routes. External publishing remains blocked.
