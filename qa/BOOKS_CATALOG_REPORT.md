# Books Catalog Report

Date: 2026-05-12

## Detected Public Book Data

No exact public book purchase links were detected inside this repo during Agent 3's scan.

Detected related evidence:

- README and docs repeatedly state that private canon, vaults and unpublished research are excluded.
- Root workspace governance classifies books/editorial as all rights reserved unless samples are explicitly approved.
- Existing public repo content supports a Books route as a catalog surface, not as a manuscript host.

## Implemented

- `src/content/books.ts`
- `/books` route
- `qa/BOOK_LINKS_NEEDED.md`

## Catalog Entries

| title | status | link | action |
|---|---|---|---|
| MEDIOEVO Public Books Catalog | needs review | Link pending | Operator must provide exact approved book titles and URLs |

## Recommendations

1. Provide approved book titles, publication status and purchase links.
2. Provide public cover images only if they are already approved for this repo.
3. Keep full manuscripts, private canon and source vaults out of this repo.
4. Use `published`, `coming soon`, `private` or `needs review` status per title.

## QA

- Local route smoke: `/books` returned HTTP 200.
- No book URL was invented.
- No manuscript was copied.
