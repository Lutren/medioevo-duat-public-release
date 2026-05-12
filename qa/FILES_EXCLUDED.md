# Files Excluded

Date: 2026-05-12

The release intentionally excludes:

- `node_modules/`
- `dist/` from source commit
- `.git/`
- `.env` and `.env.*`
- `*.pem`, `*.key`, private key names and service-account files
- raw zips, executables, installers and archives
- `99_SOURCE_VAULT` and source vault material
- raw Replit/Lovable archives
- raw MEDIOEVO canon folders
- raw `MEDIOEVO_LIVE_TREE`
- original `DUAT_DEV_DAY_ASSETS_v1.zip`
- files marked `SECURITY_REVIEW`
- private game / TCG / RPG material
- Gumroad, Stripe, Discord, YouTube or local credential/config files
- local runtime logs and session state

## Source Decisions

- Lovable/Vite app: selectively absorbed as React/Vite source, tests and MessageBus demo.
- DUAT DevDay source cards: detected, but original assets remain excluded because their cards require exact gate validation before copying.
- MEDIOEVO live tree and canon: used only as boundary context, not copied raw.
- Existing website tree: inspected as a public-surface reference, not copied wholesale.
