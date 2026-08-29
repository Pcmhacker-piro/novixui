# Novix UI — Documentation Standards

> The docs are the product.
> A component isn't done until its docs page is as polished as the component itself.

This document is the source of truth for **how Novix UI is documented**. It is the operational companion to the [Design Principles](./DESIGN_PRINCIPLES.md), the [Universal Component Specification](./COMPONENT_SPECIFICATION.md), the [API Philosophy](./API_PHILOSOPHY.md), and the [Testing Strategy](./TESTING_STRATEGY.md).

Rules:

- **Every component page follows the same 14-section structure, in the same order, using the same headings.** Predictability is a feature.
- **Every code example is real, isolated, and copy-paste runnable.** No pseudo-code, no missing imports, no "…".
- **The docs site is a first-class Novix UI product** — built with Novix UI, dogfooded, held to the same performance and accessibility budgets as the library itself.
- **Docs are reviewed with the same rigor as code.** A missing example blocks merge.

---

## The Fourteen Required Sections

Every component documentation page contains all fourteen sections, in this order. "N/A" is acceptable only with a one-line justification (e.g. "No migration notes — new in v0.3").

### 1. Overview

**What the component is, in one paragraph a developer can read in under 10 seconds.**

Includes:
- One-sentence definition (matches Section 1 of the component's spec).
- Primary use case in a real product surface.
- The **default rendered example** — no props, no configuration, just `<Button>Click</Button>` with the live preview immediately visible.
- A one-line "when to use" and "when not to use" pair.

**Rule:** If the reader can't tell what this component is for after the overview, the overview has failed.

---

### 2. Installation

**How to add this component to a project — with zero ambiguity.**

Includes:
- Package name and install command via `npm`, `pnpm`, `bun`, and `yarn` (tabbed).
- CLI command using the Novix CLI: `npx novix add <component>` (or `novix add <component>`).
- Any peer dependencies with exact commands to install them.
- The exact import statement, copyable:
  ```tsx
  import { Button } from '@novix-ui/react';
  ```
- Theme provider requirement noted if applicable (once at the app root, linked to the Theme docs).

**Rule:** A developer must be able to go from "reading this page" to "component rendered in their app" in under 60 seconds.

---

### 3. Usage

**The canonical way to use this component in production.**

Includes:
- The **simplest realistic example** — not a hello-world, but the shape a developer will actually write.
- Live preview + editable code side by side.
- A one-line note on any critical requirement (e.g. "`Dialog.Trigger` must have exactly one child").
- Link to the component's spec for deeper architectural detail.

**Rule:** The Usage example is the one developers will copy first. Make it worth copying.

---

### 4. Variants

**Every documented variant, side by side, in light and dark.**

Includes:
- A visual gallery: every `variant` × `size` combination, in a grid.
- Each variant labeled with its **stated intent** ("`destructive` — communicates irreversible action").
- Both light and dark themes visible on the same page (or a theme toggle inline).
- Do not use screenshots — variants render live so they stay current.

**Rule:** A variant that isn't in the gallery doesn't exist.

---

### 5. Live Playground

**An interactive sandbox — every canonical prop, controllable.**

Includes:
- Controls for `variant`, `size`, `radius`, `disabled`, `loading`, `leftIcon`, `rightIcon`, and any component-specific props.
- Real-time preview updating as controls change.
- Generated code snippet updating alongside — copy-paste ready.
- URL-shareable state (query params encode the current playground config) so developers can link to a specific configuration in issues, PRs, or Slack.

**Rule:** The playground is the fastest path from curiosity to code.

---

### 6. Props Table

**The complete public API — auto-generated, never hand-maintained.**

Includes:
- Every public prop with: name, type, default, description.
- Required props marked explicitly.
- Enum values expanded inline (`"primary" | "secondary" | "ghost" | "outline" | "destructive"`).
- Deprecated props marked with a strikethrough, deprecation date, and replacement.
- `asChild`, `className`, `style`, `ref`, and `data-*` support noted with a link to the API Philosophy.
- Compound components (`Card.Header`, `Card.Body`) each get their own props table.
- Generated from TypeScript source at build time — divergence between docs and types fails CI.

**Rule:** The props table is generated from the code. If the code is right, the table is right.

---

### 7. Accessibility Notes

**Developer-facing translation of the spec's accessibility section.**

Includes:
- The underlying semantic element (`<button>`, Radix primitive, etc.).
- ARIA attributes the component sets automatically vs. those the developer must provide.
- Focus management behavior (where focus goes on open, close, error).
- Screen reader announcements the component makes.
- Explicit callouts for common gotchas ("Icon-only Buttons must have `aria-label`").
- Reduced-motion behavior.
- Forced-colors behavior.
- Contrast ratios documented for each variant × theme (auto-computed from tokens).

**Rule:** A developer must be able to use this component accessibly **without reading the source** — the docs tell them everything they need.

---

### 8. Keyboard Controls

**Every key that does something, and what it does.**

Includes:
- A table of keys and actions, matching Section 6 of the component's spec exactly.
- Composite widgets (menus, tabs, combobox) document the full WAI-ARIA APG keyboard model.
- Custom shortcuts include their discoverability mechanism (tooltip, `aria-keyshortcuts`, help modal).
- An interactive keyboard demo where the user can press keys and see them highlighted on a virtual keyboard, with a live component responding.

**Rule:** Keyboard controls are documented. Keyboard controls are tested. Keyboard controls are demoed.

---

### 9. Examples

**Realistic, production-shaped examples — not toy demos.**

Includes, at minimum, one example per category (when applicable):

- **Basic** — the minimal working shape.
- **With icons** — leading, trailing, icon-only.
- **Loading & async** — real async pattern with feedback.
- **Error & validation** — realistic error surface.
- **In a form** — composed with `FormField`, `Label`, and other form primitives.
- **In a layout** — composed inside `Card`, `Dialog`, `Sidebar`.
- **Controlled** — with `value` + `onValueChange`.
- **`asChild` composition** — rendering as a `Link` or custom element.
- **Advanced** — the trickiest realistic case (e.g. `Dialog` inside `Dialog`, nested `Popover`, virtualized `Combobox`).

Every example includes:
- Live preview.
- Editable, copy-paste-runnable code.
- Real imports, real state, real handlers — no `// ...` elision.

**Rule:** Every example must **run**. Broken examples are broken docs.

---

### 10. Best Practices

**How Novix UI recommends using this component.**

Includes:
- 3–5 "Do" recommendations, each with a positive visual example.
- Composition guidance ("Prefer `Card.Header` over a `title` prop").
- Content guidance where relevant ("Button labels start with a verb").
- Density and spacing recommendations ("Group at least 8px apart in toolbars").
- Motion guidance where relevant ("Use `motionPreset='snap'` for feedback, `'soft'` for surface transitions").

**Rule:** Best practices are opinionated. Wishy-washy advice teaches nothing.

---

### 11. Common Mistakes

**The mistakes we see in real code — with the fix.**

Includes:
- 3–5 "Don't" anti-patterns, each with a **negative visual example** and its **corrected counterpart** side by side.
- The most common accessibility gotcha for this component (usually icon-only labeling, missing associations, or focus loss).
- The most common performance gotcha (usually re-render triggers, missing memoization, or oversized bundles).
- The most common API mistake (usually reinventing a canonical prop, or using state where composition would do).
- Where relevant, the **error message** the developer will see, and what to change.

**Rule:** If we see a mistake three times, it belongs on this page.

---

### 12. Performance Notes

**What this component costs, and how to keep it cheap.**

Includes:
- Bundle-size delta (gzipped) — auto-generated per release.
- Whether the component is tree-shakeable (always yes, called out explicitly).
- Any measurement, portal, or observer use, with rationale.
- Render-cost characteristics (memoized? re-renders on parent update?).
- Guidance for hot paths (large lists, streaming, virtualization).
- SSR characteristics — renders on server, matches on hydration, no CLS.
- Recommended patterns for high-density surfaces ("For > 100 instances, use the virtualized variant").

**Rule:** Developers reading this section leave knowing whether to worry.

---

### 13. Related Components

**Nearest neighbors — and how to choose between them.**

Includes:
- 3–5 components a developer might confuse with this one.
- One-line disambiguation for each ("Use `Link` for navigation, `Button` for actions").
- Cross-links to each related component's docs.
- Composition partners ("Often used with `Card`, `Dialog`, `Form`").

**Rule:** No component is an island. Every page links outward.

---

### 14. Migration Notes

**What changed, when, and how to upgrade.**

Includes:
- Version history — every change to this component since introduction, linked to the changelog.
- Breaking changes marked clearly, with the release that introduced them.
- Codemod availability, with the exact command to run.
- Migration guides from popular libraries (shadcn, Chakra, Mantine, Radix directly) — where the mapping is meaningful.
- Deprecation notices for anything on its way out, with the removal date and replacement.

**Rule:** A developer upgrading Novix UI must never be surprised. This section is why.

---

## The Docs Site Itself

The docs site is not a wrapper around the library — it **is** a Novix UI product, held to the same standards.

### Structure

- **Landing page** — hero, principles, live component gallery, roadmap, calls to action.
- **Getting Started** — install, theme setup, first component, first form, first overlay.
- **Foundations** — Design Principles, API Philosophy, Component Specification, Testing Strategy, this document, Roadmap.
- **Components** — one page per component, structured per the 14 sections above.
- **Templates** — starter projects with live previews.
- **Blocks** — copy-paste layouts and patterns.
- **Reference** — CLI, theming, tokens, migration guides, changelog.

### Site-Wide Requirements

- **Global command palette** — `⌘K` / `Ctrl+K` opens Novix UI's own Command component with fuzzy search across components, examples, tokens, and docs sections.
- **Theme toggle** — every page toggles light / dark / system, persisted, respecting `prefers-color-scheme`.
- **RTL toggle** — every component preview can be flipped to RTL inline.
- **Reduced-motion toggle** — every preview can be forced to reduced-motion inline.
- **Copy-code button** — on every code block, with confirmation via `aria-live`.
- **Deep-linkable sections** — every heading has a stable anchor and a visible "copy link" affordance.
- **Search-first navigation** — the palette is the primary nav; the sidebar is secondary.
- **Version selector** — every page renders for the current version by default; older versions accessible via a picker.
- **Edit-this-page** link on every doc, opening the source in the repo.

### Performance & Accessibility Budgets (Docs Site)

The docs site meets the same Lighthouse targets as any Novix UI template:

| Metric | Floor |
|--------|-------|
| Performance | ≥ 95 |
| Accessibility | 100 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |
| INP | < 200ms |
| CLS | 0 |
| LCP | < 1.5s on Fast 3G |

Failing any of these blocks the docs deploy — not just component releases.

### Content Standards

- **Voice:** direct, second-person, opinionated. "Use `variant='primary'` for the main action" — not "You might want to consider primary."
- **No filler.** No "Welcome!" No "This awesome component…" No emojis (unless they're the subject).
- **Concrete over abstract.** Every rule has an example. Every example is real.
- **Every code snippet is standalone.** Never `// ... rest of the code`.
- **Prose renders in the same typographic system** as the library — same font stack, same line heights, same measure.

---

## Documentation Template

Every new component page starts from this skeleton:

```mdx
---
title: <ComponentName>
description: <One-sentence definition — < 160 chars for meta description.>
status: experimental | stable | deprecated
since: v<x.y.z>
category: Primitives | Forms | Overlays | Navigation | Feedback | Data | SaaS | AI
---

# <ComponentName>

<Overview>
  {/* Section 1 — one paragraph + default live example */}
</Overview>

## Installation
{/* Section 2 — install commands, imports, peer deps */}

## Usage
{/* Section 3 — canonical realistic example */}

## Variants
{/* Section 4 — live gallery, light + dark */}

## Live Playground
{/* Section 5 — interactive sandbox with URL state */}

## Props
{/* Section 6 — auto-generated table */}

## Accessibility
{/* Section 7 — developer-facing a11y notes */}

## Keyboard Controls
{/* Section 8 — table + interactive demo */}

## Examples
{/* Section 9 — Basic, Icons, Loading, Error, Form, Layout, Controlled, asChild, Advanced */}

## Best Practices
{/* Section 10 — Do */}

## Common Mistakes
{/* Section 11 — Don't (with corrected counterpart) */}

## Performance
{/* Section 12 — bundle, tree-shaking, render cost, SSR */}

## Related Components
{/* Section 13 — disambiguation + composition partners */}

## Migration Notes
{/* Section 14 — version history, codemods, migration from other libraries */}

## Changelog
<AutoChangelog component="<ComponentName>" />
```

---

## Definition of Done, Documentation Edition

A component ships to `stable` **only** when all of the following are true:

- [ ] All 14 sections present, in order, with the required content.
- [ ] Every code example runs — verified by the docs E2E suite.
- [ ] Live playground exposes every canonical prop with URL-shareable state.
- [ ] Props table generated from source and matches implementation.
- [ ] Accessibility notes cover semantic element, ARIA, focus, SR, reduced motion, forced colors.
- [ ] Keyboard controls table matches Section 6 of the component's spec exactly.
- [ ] At least the minimum set of examples for the component category.
- [ ] Best practices and common mistakes each include ≥ 3 items with visual examples.
- [ ] Performance section includes current bundle-size delta.
- [ ] Related components linked bidirectionally.
- [ ] Migration notes include version history and codemod availability.
- [ ] Page passes docs-site Lighthouse budget.
- [ ] Page passes axe-core with zero violations.
- [ ] Named reviewer signed off on the docs checklist.

Anything less is `experimental` documentation — visible with an "in progress" banner, excluded from search, not linked from the sidebar.

---

*This document is versioned with the library. Amendments require review at the level of a spec change and must be reflected on every existing component's page within one minor release.*
