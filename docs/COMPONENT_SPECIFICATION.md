# Novix UI — Universal Component Specification

> Every component in Novix UI must document all thirteen sections below before it is considered complete.
> A component missing any section is treated as **unfinished**, regardless of how polished it looks in isolation.

This specification is the contract between the library and its consumers. It ensures every component — from `Button` to a future `DataTable` — is designed, built, reviewed, and documented against the same bar. It is the operational companion to the [Design Principles](./DESIGN_PRINCIPLES.md).

---

## How to Use This Spec

1. Before writing a single line of a new component, copy the [Template](#template) into `docs/components/<name>.md`.
2. Fill in every section. "N/A" is acceptable only with a one-line justification.
3. Implementation, tests, and docs are reviewed **against the spec**, not against the PR description.
4. Any deviation from the spec at review time requires updating the spec first, then the code.

---

## The Thirteen Sections

### 1. Purpose

**What problem does this component solve, and when should a developer reach for it?**

- One-sentence definition ("A `Button` triggers an action or navigation.").
- The **primary use case** in a real product surface.
- Explicit **non-goals**: what this component is *not* for. (`Button` is not a link. `Card` is not a container div.)
- Nearest neighbors: which components it might be confused with, and how to choose between them.

**Rule:** If the purpose cannot be stated in one sentence, the component is doing too much.

---

### 2. Variants

**What semantically distinct versions exist?**

- Enumerated, named list — `primary`, `secondary`, `ghost`, `outline`, `destructive`, etc.
- Each variant has a **stated intent** ("`destructive` communicates irreversible action").
- Variants must be **orthogonal** to size, state, and theme — never overlap.
- No open-ended variant props (no `color="#..."`, no `intent={0.7}`).
- Adding a variant requires justification: which real product need did the existing variants fail to serve?

**Rule:** Variants describe *meaning*, not *appearance*.

---

### 3. Sizes

**What size options exist, and what are their intended contexts?**

- Standard scale: `sm`, `md` (default), `lg`. Additional sizes require justification.
- Each size specifies: height, padding, font size, icon size, border radius — all from **design tokens**.
- Tap targets meet **44×44 CSS px** on touch surfaces at every size that ships on mobile.
- Sizes compose predictably: a `sm` Button next to a `sm` Input aligns without manual tuning.

**Rule:** Size is a design system decision, not a per-component decision.

---

### 4. States

**Every interactive state the component can be in.**

Document all of:

- `default`
- `hover`
- `focus-visible` (keyboard focus, always distinct from hover)
- `active` / `pressed`
- `disabled` (with `aria-disabled` semantics where appropriate)
- `loading` (with accessible announcement)
- `readonly` (for inputs)
- `invalid` / `error`
- `selected` / `checked` / `open` (for stateful components)

For each state:
- Visual treatment (token references, never hex codes).
- Interaction behavior (can it be focused? clicked? submitted?).
- Screen reader announcement, if any.

**Rule:** A state that isn't documented isn't designed.

---

### 5. Accessibility

**How the component meets WCAG 2.2 AA and beyond.**

Document:
- Underlying **semantic element** (`<button>`, `<input>`, `<a>`, or a Radix primitive).
- Required and optional **ARIA attributes** (`aria-label`, `aria-describedby`, `aria-expanded`, `aria-controls`, `role`).
- **Focus management**: where focus goes on open, close, and error.
- **Screen reader behavior**: what is announced, when, and via which live region.
- **Color contrast**: default token pairings meet AA (4.5:1 text, 3:1 UI). Verified per theme.
- **Reduced motion**: how `prefers-reduced-motion: reduce` changes behavior.
- **Forced colors** (Windows High Contrast): component remains usable and legible.
- Known assistive tech gaps (if any) and the workaround.

**Rule:** Accessibility is documented per component, not assumed from Radix.

---

### 6. Keyboard Support

**Every key that does something, and what it does.**

A table, always:

| Key | Action |
|-----|--------|
| `Tab` | Move focus to the component |
| `Shift + Tab` | Move focus away |
| `Enter` / `Space` | Activate |
| `Esc` | Close / dismiss (for overlays) |
| `Arrow keys` | Navigate within (for composite widgets) |
| `Home` / `End` | Jump to first / last (for lists) |
| `Type-ahead` | Focus matching item (for menus, selects) |

- Every keyboard interaction must have a **visible focus indicator**.
- Custom shortcuts require an accessible discovery mechanism (tooltip, help modal, `aria-keyshortcuts`).
- Keyboard parity with mouse is a hard requirement — no mouse-only affordances.

**Rule:** If a user cannot complete the task with a keyboard, the component is broken.

---

### 7. Animations

**Every motion the component performs, using shared motion primitives.**

Document:
- Which **spring preset** (`snap`, `soft`, `glide`) drives each transition.
- What property animates (`transform`, `opacity` — never `width`, `height`, `top`, `left` for perf-critical paths).
- **Trigger** (mount, hover, focus, state change) and **direction** (enter vs. exit).
- Enter duration ≤ exit duration; exits are never abrupt.
- Behavior under `prefers-reduced-motion: reduce` — typically collapse to instant.
- No animation without a communicative purpose (feedback, causality, continuity).

**Rule:** Motion is part of the API. Undocumented motion is a bug.

---

### 8. Responsive Behaviour

**How the component behaves across viewports and input modes.**

Document:
- Default behavior on mobile (< 640px), tablet (640–1024px), desktop (> 1024px).
- Which parts **reflow**, **stack**, **collapse**, or **become a sheet/drawer**.
- Touch-target sizing at each breakpoint (≥ 44×44 CSS px on touch).
- Behavior under **container queries** where the component ships with them.
- Text truncation, wrapping, and overflow strategy.
- Whether the component supports **RTL** and how mirroring is handled.
- Behavior under browser zoom up to 200% (WCAG 1.4.4).

**Rule:** "It looks fine on my laptop" is not responsive design.

---

### 9. Performance Considerations

**What this component costs, and how it stays cheap.**

Document:
- **Bundle impact** (gzipped size delta, tracked in CI).
- Whether it is **tree-shakeable** and free of side-effectful imports.
- **Render cost**: does it re-render on parent updates? Is it memoized? Does it use context?
- Any use of **portals**, **measurement** (`ResizeObserver`, `IntersectionObserver`), or **layout reads** — and why.
- **SSR behavior**: renders on the server without `window`, matches on hydration, no layout shift.
- Lazy-loaded sub-parts (e.g. virtualization, heavy adapters) are code-split.
- Performance budgets: INP < 200ms for interactions, CLS = 0 for mount, no forced synchronous layout.

**Rule:** A component that regresses performance does not merge until it doesn't.

---

### 10. Testing Requirements

**Every component ships with tests covering four layers.**

- **Unit tests**: props, variants, sizes, state transitions render correctly.
- **Interaction tests** (Testing Library + user-event): keyboard, mouse, and focus flows.
- **Accessibility tests**: automated axe-core run per variant/state combination, zero violations.
- **Visual regression** (Chromatic or equivalent): every variant × size × state × theme (light/dark) snapshot.
- **SSR test**: component renders in a Node environment without throwing and without hydration warnings.
- Coverage floor: **90% statements, 100% of public API surface exercised**.

**Rule:** Untested variants do not exist as far as the library is concerned.

---

### 11. Documentation Requirements

**Every component has a docs page with the same structure.**

Required sections on the docs page:
1. One-paragraph **overview** matching Section 1 of the spec.
2. **Live example** with editable code, using default props only.
3. **API reference** — auto-generated from TypeScript, never hand-maintained.
4. **Variants gallery** — every variant × size, light and dark, side by side.
5. **Composition examples** — realistic usage inside a product surface (form, dashboard, modal).
6. **Accessibility notes** — mirroring Section 5, in developer-facing language.
7. **Keyboard reference** — the table from Section 6.
8. **Do / Don't** — at least three of each, with visual examples.
9. **Related components** — nearest neighbors and when to prefer them.
10. **Changelog entry** — every change to the component, linked to the release.

- Every code example must be **copy-paste runnable** — no pseudo-code, no missing imports.
- Docs are reviewed with the same rigor as code.

**Rule:** If a developer needs to read the source to use the component, the docs failed.

---

### 12. Future Extensions

**What might change, and how the current design accommodates it.**

Document:
- **Planned extensions** on the roadmap (e.g. "Button will gain a `loading` slot for custom spinners in v1.2").
- **Escape hatches** available today (`asChild`, `className`, `style`, render props).
- **Explicit non-extensions**: things that will *never* be added, and why. (e.g. "Button will never accept a `href` prop — use `Button asChild` with a Link.")
- **Breaking-change risks**: which parts of the API are most likely to evolve and how consumers should insulate against it.
- **Codemod plan** for likely future migrations.

**Rule:** Design for the extension you can predict; leave escape hatches for the one you can't.

---

### 13. Ownership & Review

**Who is responsible, and how change is governed.**

- **Owner**: named maintainer accountable for the component's health.
- **Reviewers**: minimum of one design and one engineering reviewer for any change.
- **Status**: `experimental` / `stable` / `deprecated`. Experimental components are marked in docs and excluded from semver guarantees.
- **Semver commitment**: what constitutes a patch, minor, and major change for this component.
- **Deprecation policy**: minimum notice period, migration guide requirement, codemod requirement.

**Rule:** Every component has a name attached. Orphan components are removed.

---

## Template

Copy this into `docs/components/<name>.md` before implementation begins.

```markdown
# <ComponentName>

**Status:** experimental | stable | deprecated
**Owner:** @<handle>
**Since:** v<x.y.z>

## 1. Purpose
<One sentence. Primary use case. Non-goals. Nearest neighbors.>

## 2. Variants
<Enumerated list with stated intent for each.>

## 3. Sizes
<sm / md / lg with token-backed dimensions.>

## 4. States
<default, hover, focus-visible, active, disabled, loading, invalid, selected, ...>

## 5. Accessibility
<Semantic element, ARIA, focus management, SR announcements, contrast, reduced motion, forced colors.>

## 6. Keyboard Support
<Table of keys and actions.>

## 7. Animations
<Motion presets, animated properties, triggers, reduced-motion behavior.>

## 8. Responsive Behaviour
<Mobile / tablet / desktop behavior, touch targets, RTL, zoom.>

## 9. Performance Considerations
<Bundle impact, render cost, SSR, budgets.>

## 10. Testing Requirements
<Unit, interaction, a11y, visual regression, SSR, coverage.>

## 11. Documentation Requirements
<Confirm all 10 docs sections exist and are current.>

## 12. Future Extensions
<Planned extensions, escape hatches, non-extensions, breaking-change risks.>

## 13. Ownership & Review
<Owner, reviewers, status, semver, deprecation policy.>
```

---

## Definition of Done

A component ships to `stable` **only** when all of the following are true:

- [ ] Spec document exists at `docs/components/<name>.md` with all 13 sections filled.
- [ ] Implementation matches every documented variant, size, and state.
- [ ] Accessibility audit passes (axe-core, keyboard walkthrough, screen reader smoke test on VoiceOver + NVDA).
- [ ] Tests meet the requirements in Section 10, all green in CI.
- [ ] Docs page meets every requirement in Section 11.
- [ ] Bundle-size delta reviewed and accepted.
- [ ] Design and engineering reviewers signed off.
- [ ] Changelog entry written.

Anything less is `experimental` — usable, but not promised.

---

*This specification is versioned with the library. Amendments require the same review rigor as a breaking API change and must be reflected in every existing component's spec within one minor release.*
