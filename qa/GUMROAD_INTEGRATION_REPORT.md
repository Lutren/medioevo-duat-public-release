# Gumroad Integration Report

Date: 2026-05-12

## Products Detected

| product | URL | status | verification |
|---|---|---|---|
| DUAT Templates | https://lrgonzalez.gumroad.com/l/duat-templates | live candidate | HEAD returned HTTP 200 |
| L.R. Gonzalez Gumroad profile | https://lrgonzalez.gumroad.com/ | external store profile | HEAD returned HTTP 200 |

## Implementation

- `src/content/gumroadProducts.ts`
- `/store` route
- `/gumroad` route
- Direct external links only:
  - Buy on Gumroad
  - View product
  - Open store

## API And Token Boundary

- Gumroad API was not used.
- No Gumroad token was requested, printed, stored or required.
- No Gumroad product was created, edited, published or unpublished.
- No embed script was added; direct links are enough for the current public site.

## Commercial Notes

Coordinator-provided Gumroad context for analysis only:

- Direct/profile sales: 10% + $0.50.
- Gumroad Discover: 30%.
- Merchant of Record/tax handling since 2025.
- Supports digital products, e-books, courses, tutorials and memberships.

The site does not hardcode a product price. Gumroad remains the source of truth.

## Recommended Next Manual Steps

1. Confirm the DUAT Templates listing image and price in Gumroad UI.
2. Confirm whether the public profile should list other approved products.
3. Add exact book products only after approved links are supplied.
4. Keep API/write operations blocked unless a later operator explicitly authorizes them.
