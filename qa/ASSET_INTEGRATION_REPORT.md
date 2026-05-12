# Asset Integration Report

Date: 2026-05-12

## Asset Source

Found in operator-provided candidate root:

- `<operator-desktop>/-= BRAIN_OS =-/DUAT_DEV_DAY_ASSETS_v1.zip`
- `<operator-desktop>/-= BRAIN_OS =-/DUAT ASSETS/`

ZIP SHA256:

```text
FB42DE5FA7191A6F37B97C9E4136E7CB0C39AF29A5DC3DE91DE1F822F3747E68
```

## ZIP Structure Verified

- `brand/`
- `icons/svg/`
- `icons/png/`
- `ui/svg/`
- `ui/png/`
- `backgrounds/svg/`
- `backgrounds/png/`
- `posters/svg/`
- `posters/png/`
- `lovable_patch/`
- `prompts/`
- `submission/`
- `previews/`

## Copied Into Public Release

Runtime assets:

- `public/duat-assets/brand/`
- `public/duat-assets/icons/`
- `public/duat-assets/ui/`
- `public/duat-assets/backgrounds/`
- `public/duat-assets/posters/`

Repository asset mirror:

- `assets/brand/`
- `assets/icons/`
- `assets/ui/`
- `assets/backgrounds/`
- `assets/posters/`

Public text:

- `src/content/devday/DEV_DAY_SUBMISSION_TEXT_EN.md`
- `src/content/devday/STYLE_GUIDE_DUAT_DISPLAY.md`
- `docs/DEV_DAY_SUBMISSION_TEXT_EN.md`

## Key Runtime Assets

- `public/duat-assets/posters/png/duat-display-concept-generated.png`
  - bytes: `2043877`
  - SHA256 prefix: `EBC763D73326521C`
- `public/duat-assets/posters/png/duat-devday-hero.png`
  - bytes: `273644`
  - SHA256 prefix: `A35C91746BF4A446`
- `public/duat-assets/posters/png/duat-social-card.png`
  - bytes: `115906`
  - SHA256 prefix: `7F5D98ADCE708E4A`
- `public/duat-assets/brand/duat-logo-mark.svg`
  - bytes: `2415`
  - SHA256 prefix: `0591BB4CD9E278FF`
- `public/duat-assets/brand/duat-wordmark.svg`
  - bytes: `2404`
  - SHA256 prefix: `598D626366E8EAD5`

## Omitted

- `prompts/`: omitted; not required for runtime and may contain internal strategy.
- `lovable_patch/`: omitted raw; read and adapted.
- `previews/`: omitted; review artifact.
- `ASSET_MANIFEST.json`: omitted; this report acts as public integration evidence.
- original ZIP: omitted; raw archives are not public release content.

## DevDay Route Confirmation

`/duat-devday` now uses real approved assets:

- main concept image: `/duat-assets/posters/png/duat-display-concept-generated.png`
- hero image: `/duat-assets/posters/png/duat-devday-hero.png`
- social card image: `/duat-assets/posters/png/duat-social-card.png`
- logo mark: `/duat-assets/brand/duat-logo-mark.svg`
- wordmark: `/duat-assets/brand/duat-wordmark.svg`

The previous placeholder visual remains in `assets/posters/devday-public-placeholder.svg` only as an old tracked artifact and is no longer used by `/duat-devday`.
