# Elements Gallery

The Elements Gallery is Novix UI's showcase of premium, 3D-animated, hover-reactive
component variants. It lives at `/elements` in the docs site and is powered by the
data modules under `src/data/*.tsx`. Every item ships with a live preview, a Get
Code modal (React + HTML/CSS/Vue/Svelte snippets), and a 1:1 modal preview that
mirrors the gallery tile exactly.

> **Status:** ✅ Shipped as part of v0.7. Total: **~381 unique variants** across
> 11 categories. Counts below are source-of-truth.

## Categories

| Category | File | Variants | Notes |
|---|---|---:|---|
| Buttons | `src/data/buttons.tsx` | 100 (25 styles × 4 hues) | Multi-color palettes (Nebula, Lagoon, Sunset, Cosmic). Layered shadows, tactile press physics. |
| Checkboxes | `src/data/checkboxes.tsx` | 70 | Ref-based hover-preview that flips real checked state. |
| Toggles | `src/data/toggles.tsx` | 50 | Matching hover-preview behavior. |
| Loaders | `src/data/loaders.tsx` | 30 | Pure CSS + SVG, motion-safe. |
| Radios | `src/data/radios.tsx` | 30 | Full keyboard model preserved. |
| Tooltips | `src/data/tooltips.tsx` | 25 | Hover-host lifting so previews trigger inside the modal too. |
| Inputs | `src/data/inputs.tsx` | 25 | Floating labels, animated borders, invalid/loading states. |
| Cards | `src/data/cards.tsx` | 11 | Halo Hover + Moon-Edge on every tile. |
| Patterns | `src/data/patterns.tsx` | 15 | Composed multi-primitive patterns. |
| Forms | `src/data/forms.tsx` | 10 | Realistic full-form recipes. |
| UI Kits | `src/data/kits.tsx` | 15 | Larger 720×420 dashboards / SaaS scenes. |

## Signature techniques used

- **Hover-host attributes** (`data-cb-hover-host`, `data-tg-hover-host`, …) let
  the gallery card AND the modal preview drive the same hover state without a
  shared React tree.
- **Ref-based checked flip** on Checkboxes / Toggles: hover temporarily updates
  the real DOM checked/aria state, so animations play against the true target
  rather than a fake preview.
- **Multi-color palettes** for Buttons — `from` → `via` → `to` mix three hues so
  variants never look like single-color recolors.
- **Moon-Edge + Halo Hover + Press Sink** on every tile wrapper (see
  [DESIGN_LANGUAGE.md](../DESIGN_LANGUAGE.md)).

## Parity guarantees

The modal preview must render identically to the gallery tile. Three enforcement
layers exist:

1. **Runtime parity** — `CodeModal` accepts a `preview` prop that passes the
   actual gallery card component through, so it renders 1:1 (no re-implemented
   wrapper). Fallback wrapper mirrors card padding, gradient, border, and Moon-
   Edge highlight.
2. **Automated visual tests** —
   - `tests/visual/card-vs-modal.py` — per-pixel diff (`--pixel-threshold`,
     `--layout-tolerance`, per-channel `--pixel-tolerance`).
   - `tests/visual/card-vs-modal-styles.py` — computed style parity
     (`padding`, `gap`, `display`, `flexDirection`, `justifyContent`,
     `alignItems`, `textAlign`).
   - `tests/visual/reduced-motion-parity.py` — same tile captured in
     `no-preference` and `reduce` motion modes; fails on layout, pixel, or
     card/modal ratio drift between modes.
3. **Manual QA story** —
   `src/nova/ui/__stories__/card-vs-modal-parity.stories.tsx` renders the tile
   and modal preview side-by-side with a togglable red centerline overlay.

## Deep linking

Every item is deep-linkable via `?item=<id>` on `/elements`. `Cmd/Ctrl + K`
opens the global command palette which searches all categories and items.

## Related pages

- `/design` — service-site generator that opens each system in a 3D browser-
  mockup modal with a Preview/Code tabbed view and ZIP export.
- `/docs/atelier` and `/docs/lab` — Aceternity-inspired visual primitives
  (Aurora, Meteors, Marquee, Ticker, Status, …) that many gallery items are
  composed from.
