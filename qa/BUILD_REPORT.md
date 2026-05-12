# Build Report

Date: 2026-05-12

## Commands

```bash
npm install
npm audit --audit-level=moderate
npm test
npm run build
npm run lint --if-present
```

## Results

- `npm install`: completed after dependency update.
- `npm audit --audit-level=moderate`: PASS, 0 vulnerabilities.
- `npm test`: PASS, 2 test files, 15 tests.
- `npm run build`: PASS, Vite 8.0.12 production build.
- `npm run lint --if-present`: NOT_APPLICABLE, no lint script configured.

## Build Output

```text
dist/index.html
dist/assets/index-CK87hKsA.css
dist/assets/index-DwAUjQiV.js
```

## Local Route Smoke

Vite dev server started on `http://127.0.0.1:5179/`.

- `/` -> HTTP 200
- `/duat` -> HTTP 200
- `/telecom` -> HTTP 200
- `/handoff-hub` -> HTTP 200
- `/duat-devday` -> HTTP 200
- `/docs` -> HTTP 200

Browser screenshot automation was not available in this session; HTTP route smoke and production build passed.
