# Canonical Routing Report

Date: 2026-05-12 05:35:21 -06:00

## Policy

- Recommended canonical URL: `https://medioevo.space`
- Secondary URL: `https://www.medioevo.space`

## Observed Routing

| URL | Status | Redirect observed |
|---|---|---|
| `https://medioevo.space` | HTTP 200 | no |
| `https://www.medioevo.space` | HTTP 200 | no |
| `https://medioevo-site.pages.dev` | HTTP 200 | no |
| `https://de922a65.medioevo-site.pages.dev` | HTTP 200 | no |

## Decision

Status: ACCEPTABLE.

Both apex and `www` resolve and serve the same public release over HTTPS. Because P5 did not authorize DNS or redirect changes, no routing rule was changed.

## Recommendation

In a future maintenance pass, choose whether `www.medioevo.space` should redirect to `https://medioevo.space`. That change should be done only after confirming it will not affect mail, subdomains, analytics or other services.

## Changes Made

No DNS records, nameservers, Cloudflare routes or redirect rules were changed in P5.
