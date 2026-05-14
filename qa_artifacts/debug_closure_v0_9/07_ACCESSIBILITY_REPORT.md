# ACCESSIBILITY REPORT v0.9 DEBUG CLOSURE

Status: PASS_WITH_MANUAL_CDP_CHECKS
Date: 2026-05-14

## Method

No axe dependency was installed. Accessibility checks used DOM/static review plus the local CDP browser probe.

## Blind User Support

- Buttons and links have visible text or explicit accessible labels: PASS.
- Command Console input has visible label plus `aria-label`: PASS.
- Visual effects checkbox has visible label plus `aria-label`: PASS.
- Main route region exists through `main`: PASS.
- Routes expose visible headings: PASS.
- Primary navigation uses `nav aria-label`: PASS.
- Focus-visible styling exists for links, buttons, select and command input: PASS.
- Decorative images use empty alt where appropriate; informative DUAT DevDay images use descriptive alt text: PASS.
- `/duat-city` includes a text Command Console shell with fallback transcript: PASS.

## Deaf User Support

- No audio-only state was introduced: PASS.
- Command Console uses visible transcript/log text: PASS.
- Visual effects can be muted with a visible checkbox: PASS.

## Command Shell Scope

Supported demo commands: `help`, `open menu`, `go landing`, `go tools`, `equip`, `attack`, `inspect`, `back`.

The shell is public-safe and local text only. It does not implement combat, profiles, real voice, backend state or private runtime access.
