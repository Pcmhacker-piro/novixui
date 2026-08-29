# Novix UI — Theme Generator (Design Spec)

Status: Planned · Target release: v0.6 (see `ROADMAP.md`) · Owner: Design Systems

The Theme Generator is a first-class product surface, not a marketing toy. It is
the fastest path from "I like Novix UI" to "Novix UI looks like *our* product."
It must produce output that is **indistinguishable from a hand-authored theme**
— same token names, same file shape, same guarantees.

This document defines the philosophy, UX, token model, and export contracts.
No implementation yet; this is the source of truth the future build follows.

---

## 1. Principles

1. **Tokens in, tokens out.** The generator only ever edits semantic tokens
   defined in `packages/tokens`. It never invents new tokens, never hard-codes
   colors in components, and never bypasses the theme layer.
2. **Preview is the spec.** Every control updates a live preview of real Nova
   UI components in the same frame. If it doesn't render in the preview, it
   isn't in the generator.
3. **Accessible by construction.** Contrast, focus visibility, and reduced
   motion are validated continuously. Invalid themes cannot be exported.
4. **Deterministic output.** Same inputs → byte-identical exports. No
   timestamps, no randomized ordering, no environment leakage.
5. **Portable.** Exports work in any React + Tailwind v4 project, with or
   without the rest of Novix UI installed.
6. **Progressive.** Sensible defaults out of the box; power-user controls
   revealed on demand.

---

## 2. User Surfaces

### 2.1 Web Generator (`/themes/new`)
- Split layout: **Controls** (left, ~360px) · **Live Preview** (right, fluid).
- Preview renders a representative gallery: Button (all variants), Input, Card,
  Badge, Dialog, Command, Chat message, Data row, Chart tile.
- Sticky top bar: theme name, light/dark toggle, contrast report, `Export ▾`.
- Sticky bottom bar: undo/redo, reset to preset, share link (URL-encoded state).

### 2.2 CLI (`npx novix theme` / `novix theme`)
- Interactive prompts mirroring the web controls.
- `--from <preset>`, `--seed <hex>`, `--output <dir>`, `--format css|tailwind|json|all`.
- Non-interactive mode for CI: reads a `novix.theme.json` and writes exports.

### 2.3 Programmatic API
```ts
import { createTheme, exportCSS, exportTailwind, exportTokens } from "@novix-ui/theme-generator";
```
Same engine powers web, CLI, and API. One source of truth.

---

## 3. Controls

Each control edits a bounded set of semantic tokens. Ranges are enforced; free
input is validated and clamped.

| Control | Edits | Input | Constraints |
|---|---|---|---|
| **Primary color** | `--color-primary` + generated scale (50–950) + `--color-primary-foreground` | Hex / OKLCH / picker | Auto-derives foreground for AA contrast; warns below 4.5:1 |
| **Accent color** | `--color-accent` + scale + foreground | Hex / OKLCH / picker | Must differ from primary in hue by ≥15°; warns otherwise |
| **Typography** | `--font-sans`, `--font-display`, `--font-mono`, type scale ratio | Presets (Geist, Inter, IBM Plex, JetBrains, System) + ratio slider (1.125–1.333) | Google/self-hosted fonts declared, never `@import`ed remotely |
| **Border radius** | `--radius-{xs,sm,md,lg,xl,2xl,full}` | Base slider 0–16px + curve (linear/geometric) | All radii derived from base; individual overrides allowed |
| **Spacing scale** | `--space-{0..24}` | Base unit 2–6px + ratio (linear / 1.25 / 1.5 / golden) | Monotonic; step 0 always 0 |
| **Shadow system** | `--shadow-{xs,sm,md,lg,xl,2xl,glow}` | Intensity slider + tint (neutral / primary) + elevation curve | Uses `color-mix` for tinting; disabled shadows collapse to `none` cleanly |
| **Animation speed** | `--motion-duration-{fast,base,slow}`, `--motion-ease-*` | Global multiplier 0.5×–1.5× + easing preset | Respects `prefers-reduced-motion`; multiplier ≤1 in reduced-motion output |
| **Density** | `--density` scalar → padding, control height, gap defaults | Comfortable / Cozy / Compact | Maps to `--control-h-{sm,md,lg}` and `--pad-*` |

All controls emit into a single normalized `ThemeState`:
```ts
type ThemeState = {
  name: string;
  mode: "light" | "dark" | "both";
  color: { primary: OKLCH; accent: OKLCH; neutral: OKLCH };
  typography: { sans: FontRef; display: FontRef; mono: FontRef; ratio: number };
  radius: { base: number; curve: "linear" | "geometric"; overrides?: Partial<RadiusScale> };
  spacing: { base: number; ratio: number };
  shadow: { intensity: number; tint: "neutral" | "primary"; enabled: boolean };
  motion: { multiplier: number; ease: EasePreset; reducedMotion: "auto" | "off" };
  density: "comfortable" | "cozy" | "compact";
};
```

---

## 4. Derivation Rules

- **Color scales** are generated in OKLCH by walking lightness on a fixed curve
  and holding chroma within a gamut-safe envelope. The seed color lands on
  step 500 (light) / 400 (dark). Foregrounds are picked from the scale to
  guarantee ≥AA contrast against their paired surface.
- **Dark mode** is derived, not authored twice. The engine mirrors the
  lightness curve and re-picks foregrounds. Users may override any dark-mode
  token individually; overrides are marked and preserved.
- **Radius, spacing, shadow, motion** scales are computed from base + curve.
  Overrides at any step are preserved across regeneration.
- **Density** does not change tokens' identities — it changes the values bound
  to `--control-h-*` and `--pad-*`, which components already consume.

---

## 5. Validation

Every state change runs the validator. Export is blocked while any error is
active; warnings are surfaced but non-blocking.

| Check | Level | Rule |
|---|---|---|
| Text contrast | Error | All foreground/background pairs ≥ WCAG AA (4.5:1 body, 3:1 large) |
| Non-text contrast | Error | Focus ring, borders on interactive controls ≥ 3:1 |
| Primary vs accent distinctness | Warning | Hue delta ≥ 15° or lightness delta ≥ 10% |
| Reduced-motion output | Error | With `prefers-reduced-motion`, durations ≤ base and no infinite loops |
| Gamut | Warning | OKLCH values outside sRGB are flagged; export clamps with `color()` fallback |
| Token completeness | Error | Every semantic token has a resolved value in both modes |

The contrast report is always visible in the top bar with a single score and a
drill-down list of failing pairs.

---

## 6. Presets

Ship a curated set. Each preset is a `ThemeState`, not a stylesheet.
- **Nova** — the default.
- **Graphite** — monochrome, editorial.
- **Aurora** — vivid gradient-friendly.
- **Terminal** — mono type, high contrast.
- **Sunrise** — warm neutrals, soft shadows.
- **Midnight** — dark-first, low chroma.

Presets are also the fixtures for visual regression tests.

---

## 7. Export Contracts

Exports are **pure functions of `ThemeState`**. Same input → same bytes.
All exports include a header comment with the generator version and a hash of
the input state (not a timestamp) for traceability.

### 7.1 CSS Variables — `nova-theme.css`
```css
/* Novix UI theme — generated. Do not edit by hand. */
/* generator: @novix-ui/theme-generator@X.Y.Z  state-hash: <sha256-12> */

@import "tailwindcss";

:root {
  --color-bg: oklch(…);
  --color-fg: oklch(…);
  --color-primary: oklch(…);
  --color-primary-foreground: oklch(…);
  /* …full semantic surface… */
  --radius-md: 0.5rem;
  --space-4: 1rem;
  --shadow-md: 0 4px 12px -2px color-mix(in oklab, var(--color-fg) 12%, transparent);
  --motion-duration-base: 180ms;
  --motion-ease-standard: cubic-bezier(.2,.8,.2,1);
}

.dark { /* mirrored tokens */ }

@theme inline {
  --color-primary: var(--color-primary);
  /* …bind semantic tokens into Tailwind's theme… */
}
```
Rules: no component styles; no resets; safe to drop into any Tailwind v4 app.

### 7.2 Tailwind Theme — `nova-theme.tailwind.css`
A Tailwind v4 `@theme` block only, for teams who already have their own
`:root` tokens and want Nova's semantic mapping:
```css
@theme {
  --color-primary: oklch(…);
  --font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
  --radius-md: 0.5rem;
  /* … */
}
```
No `@import`, no selectors. Composes cleanly with the CSS-variables export.

### 7.3 JSON Design Tokens — `nova-theme.tokens.json`
Compliant with the **DTCG** format (`$value`, `$type`, `$description`) so it
round-trips through Style Dictionary, Figma Tokens, and Terrazzo:
```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "primary": { "$value": "oklch(0.62 0.19 256)", "$type": "color" },
    "primary-foreground": { "$value": "oklch(0.98 0 0)", "$type": "color" }
  },
  "radius": { "md": { "$value": "8px", "$type": "dimension" } },
  "motion": {
    "duration-base": { "$value": "180ms", "$type": "duration" },
    "ease-standard": { "$value": [0.2, 0.8, 0.2, 1], "$type": "cubicBezier" }
  }
}
```
Modes are emitted as `$extensions."nova.mode"` groups (`light`, `dark`) so a
single file carries both without duplicating structure.

### 7.4 Bundle — `nova-theme.zip`
`Export ▾ → All formats` produces:
```
nova-theme/
  nova-theme.css
  nova-theme.tailwind.css
  nova-theme.tokens.json
  nova.theme.json      # the ThemeState itself, replayable in the generator
  README.md            # install steps, versioned to the generator
```

---

## 8. State, Sharing, Persistence

- **URL** is the canonical state: `?t=<base64url(ThemeState)>`. Sharable,
  bookmarkable, diffable in PRs.
- **LocalStorage** caches the last edited theme per browser; never the source
  of truth.
- **`nova.theme.json`** is the on-disk source of truth for teams. The CLI and
  web generator both read/write it.

---

## 9. Accessibility (of the generator itself)

The generator is a Novix UI product and eats its own dog food:
- Full keyboard operation; no drag-only controls (sliders have number inputs).
- Every color picker exposes hex + OKLCH text inputs alongside the visual picker.
- Live regions announce contrast changes and validation errors.
- Preview honors `prefers-reduced-motion` and `prefers-color-scheme`.

---

## 10. Performance

- State updates debounce token recomputation (16ms) and preview repaint (rAF).
- Recomputation is incremental: only tokens downstream of the changed input
  are recalculated.
- Exports are generated in a Web Worker; the UI never blocks.
- Cold load of `/themes/new` ≤ 120KB gzipped JS excluding fonts.

---

## 11. Testing

- **Unit** — derivation functions (color scales, radius curves, contrast).
- **Property-based** — for any valid seed, all foregrounds meet AA.
- **Snapshot** — every preset's three exports are byte-stable.
- **Visual regression** — preview gallery per preset, light + dark.
- **A11y** — axe on the generator UI and on the preview gallery per preset.
- **E2E** — edit → export → drop CSS into a fresh Vite app → build passes.

Test matrix lives in `TESTING_STRATEGY.md`; the generator inherits all
cross-cutting gates.

---

## 12. Non-Goals

- No component-level style overrides. If a component needs a new knob, it
  belongs in the component API, not the theme generator.
- No arbitrary CSS injection in exports. Exports are tokens, not stylesheets.
- No account system, no cloud storage. State lives in the URL and on disk.
- No Figma plugin in v0.6 — DTCG JSON is the bridge; a plugin ships later if
  demand warrants.

---

## 13. Open Questions (tracked, not blocking)

- Do we expose a "brand extraction" flow (upload logo → seed color)? Lean yes,
  behind a flag, once contrast validation is bulletproof.
- Do we ship a VS Code extension that previews a `nova.theme.json` inline?
  Deferred to post-v1.0.
- Multi-brand theming (one app, multiple themed subtrees) — supported by the
  token model already; needs a documented pattern, not new tokens.

---

## 14. Definition of Done (v0.6)

- Web generator, CLI, and programmatic API all consume the same engine.
- Six presets ship, each passing all validators in light and dark.
- Three export formats are byte-stable across runs and across platforms.
- Exports drop into a fresh Vite + Tailwind v4 app with zero manual edits.
- Docs page at `/docs/theming/generator` covers every control, every export,
  and the round-trip workflow with a real repo example.
