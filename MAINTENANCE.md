# Public Maintenance Guide

This guide covers the public release repository only. It does not authorize publication of private canon, unpublished research, local logs, internal ZIPs, or credentials.

## Local Setup

```bash
npm install
npm run dev
npm test
npm run build
```

## Pre-Release Checklist

- Run `npm test`.
- Run `npm run build`.
- Run `npm audit --audit-level=moderate`.
- Run the focused secret scan for this public release.
- Check public routes:
  - `/`
  - `/duat`
  - `/telecom`
  - `/handoff-hub`
  - `/duat-devday`
  - `/docs`
- Check page metadata and social preview tags.
- Update `CHANGELOG.md` if public behavior changed.
- Avoid unsupported autonomous general intelligence, government-production, scientific, medical, financial, or externally validated claims.

## Deploy Notes

- Cloudflare Pages project: `medioevo-site`
- Build command: `npm run build`
- Output directory: `dist`
- Canonical URL: [https://medioevo.space](https://medioevo.space)
- Secondary URL: [https://www.medioevo.space](https://www.medioevo.space)

Do not change DNS, redirects, or Cloudflare project configuration during routine maintenance without a separate release plan and QA pass.

## Public / Private Boundary

- Never publish private canon.
- Never publish internal ZIPs, archives, backups, or source vaults.
- Never publish `.env`, `.env.*`, credentials, tokens, cookies, or service accounts.
- Never publish local logs, local configs, local private paths, or operator runtime state.
- Never publish private game, TCG, paid-source, or unpublished research material.

## Future Tag Policy

- Use `v0.1.x-public` for public display maintenance.
- Avoid `v1.0` until product claims, reliability, support, and external evidence are stronger.
