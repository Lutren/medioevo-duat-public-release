# SSL Route Check Report

Date: 2026-05-12 05:35:21 -06:00

## HTTPS Endpoints

| URL | Result | Redirect |
|---|---|---|
| `https://medioevo.space` | HTTP 200 | none |
| `https://www.medioevo.space` | HTTP 200 | none |
| `https://medioevo-site.pages.dev` | HTTP 200 | none |
| `https://de922a65.medioevo-site.pages.dev` | HTTP 200 | none |

TLS/SSL was checked with `curl.exe -I` and `curl.exe -vI` over HTTPS. The client completed TLS negotiation through Windows Schannel and returned HTTP 200 without SSL errors, 525/526 responses or redirect loops.

## Direct Route Reload

| Route | Apex | WWW |
|---|---|---|
| `/` | HTTP 200 | HTTP 200 |
| `/duat` | HTTP 200 | HTTP 200 |
| `/telecom` | HTTP 200 | HTTP 200 |
| `/handoff-hub` | HTTP 200 | HTTP 200 |
| `/duat-devday` | HTTP 200 | HTTP 200 |
| `/docs` | HTTP 200 | HTTP 200 |

## Notes

- Cloudflare Pages `_redirects` was present in the deployed `dist/` output.
- Direct reload did not produce SPA 404s.
- No DNS records were changed.
