# I18N REPORT v0.9 DEBUG CLOSURE

Status: PASS_BASIC_I18N
Date: 2026-05-14

## Scope

Added minimal client-side i18n scaffolding for:

- `en`: English.
- `es`: Espanol.
- `ru`: Русский.
- `zh`: 中文.

## Implementation

- Language selector added to the public SPA header.
- Fallback language: English.
- Persistence: `localStorage` key `medioevo-duat-language` only.
- Localized critical labels/copy for navigation, `/landing` Simple Mode and `/duat-city` public demo.
- No secrets, profiles, account data or tokens are stored.

## QA

- i18n browser probe: PASS, 4/4 languages.
- Ruso y chino no rompieron layout en `/duat-city` mobile smoke.

## Known Limit

Static public HTML pages remain mostly English. They did not break under the new selector because they are independent static pages.
