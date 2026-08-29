# Novix UI — Design Principles

> The source of truth for every design, engineering, and product decision in Novix UI.
> If a proposal conflicts with these principles, the proposal changes — not the principles.

Novix UI exists to give SaaS, AI, and startup teams a component library that feels like it was built by the product teams at Vercel, Linear, Stripe, Framer, Apple, and Raycast — without the years of internal iteration. These principles describe *how* we get there and *why* we say no to things that look tempting on the surface.

---

## 1. Accessibility First

Accessibility is a **precondition**, not a feature.

- Every interactive component ships with correct semantics, keyboard support, focus management, and ARIA wiring — verified before merge.
- We target **WCAG 2.2 AA** as the floor. Color contrast, hit targets (≥ 24×24 CSS px), motion safety, and reduced-motion behavior are non-negotiable.
- We build on **Radix primitives** for focus traps, roving tabindex, and portal semantics — we do not reinvent them.
- Screen reader labels, `aria-live` regions, and `prefers-reduced-motion` are part of the component contract, not opt-ins.
- A component without keyboard parity to its mouse behavior is considered **broken**, not incomplete.

**Rule:** If a feature cannot be made accessible, it does not ship.

---

## 2. Beautiful Defaults

The default should look like the "after" screenshot, not the "before."

- Zero-config usage must produce a UI that would be acceptable in a production Vercel, Linear, or Stripe surface.
- Spacing, radius, shadow, motion, and typography defaults are tuned as a **system**, not per-component.
- We favor restraint: monochrome bases, one accent, purposeful depth. No purple gradients on white. No AI-generic aesthetics.
- Dark mode is a **first-class default**, tuned separately — never an inverted light theme.
- "Looks good in the docs" is the minimum bar. "Looks good dropped into a real dashboard at 3am" is the actual bar.

**Rule:** If a developer has to style a component to make it presentable, the default is wrong.

---

## 3. Composition over Configuration

We expose small, composable parts — not god-components with 40 props.

- Prefer `<Dialog.Root><Dialog.Trigger/><Dialog.Content/></Dialog.Root>` over `<Dialog title="" footer="" onSubmit=""/>`.
- Props describe *what a thing is*, not *what a thing contains*. Content is `children`.
- The `asChild` pattern (Radix Slot) is our escape hatch — any component can render as any element without wrappers.
- Variants are **enumerated**, not open-ended. `variant="primary"` beats `color="#3B82F6" tone={0.4} intent="cta"`.
- If a prop exists to work around missing composition, delete the prop and add composition.

**Rule:** When in doubt, expose the smaller piece.

---

## 4. Performance by Default

Users don't care about your bundle graph — until it costs them a paint.

- Every component is **tree-shakeable**. No barrel-file side effects. No importing the whole library to use a Button.
- Zero runtime CSS-in-JS. Styling is Tailwind v4 tokens compiled at build time.
- Animations run on the compositor (`transform`, `opacity`) via **Motion**. No layout-thrashing keyframes.
- Server-render safe by default: no `window` at module scope, no hydration mismatches, no client-only imports leaking into SSR routes.
- Component code paths favor **the fast case**: cheap default render, opt-in for expensive behavior (virtualization, portals, measurement).

**Rule:** A component that regresses INP, CLS, or bundle size does not merge, no matter how pretty it is.

---

## 5. Minimal API Surface

Every prop is a maintenance liability forever.

- New props must justify their existence against `children`, `className`, `asChild`, or a variant.
- No boolean flags that could be a variant. No variants that could be composition. No configuration for things the design system already decided.
- Names are boring and predictable: `variant`, `size`, `disabled`, `loading`, `leadingIcon`, `trailingIcon`. Same words, same meaning, every component.
- Deprecations are explicit, dated, and codemod-able. Silent breaks are forbidden.
- The best API is the one a developer can guess correctly on the first try without opening the docs.

**Rule:** If two props do overlapping work, one of them is wrong.

---

## 6. Consistent Motion

Motion is a **language**, not decoration.

- All motion uses the shared spring presets: `snap` (feedback), `soft` (surface transitions), `glide` (large movements). No ad-hoc `duration: 0.3, ease: 'easeInOut'`.
- Motion communicates **causality** (what triggered what), **hierarchy** (what matters), and **continuity** (where an element came from and went to).
- Enter animations are faster than exit animations. Exits are never abrupt.
- `prefers-reduced-motion: reduce` collapses all non-essential motion to instant transitions — automatically, at the primitive level.
- We do not animate for the sake of animating. Micro-interactions must earn their frames.

**Rule:** If motion doesn't communicate something, remove it.

---

## 7. Semantic Design Tokens

Colors, spacing, radii, and shadows are **meaning**, not values.

- Components reference semantic tokens (`--surface`, `--surface-elevated`, `--foreground`, `--border`, `--accent`), never raw values (`#0F172A`, `bg-black`, `text-white`).
- Tokens are defined once in `styles.css` using OKLCH, mirrored in TypeScript for programmatic access, and themed through CSS variables.
- Light and dark themes swap **token values**, never component code.
- Brand overrides happen at the token layer — a consumer rebrands Nova by remapping ~20 CSS variables, not by forking components.
- Hardcoding a color anywhere in the component layer is a bug.

**Rule:** If a component knows a hex code, the abstraction has failed.

---

## 8. Developer Experience First

The library is a product. Developers are the users.

- Full TypeScript inference everywhere. Polymorphic `as` props preserve element types. No `any`, no `unknown` escape hatches in public APIs.
- Autocomplete is the documentation. Prop names, variants, and JSDoc must be usable without leaving the editor.
- Errors are **actionable**: "Card.Header must be used inside Card.Root" beats "Cannot read properties of undefined."
- Copy-paste from docs must work — every example is a real, isolated, runnable snippet.
- Install → import → render should take under 60 seconds for the first component.

**Rule:** If a developer has to read the source to use it correctly, the API has failed.

---

## 9. Long-Term Maintainability

Novix UI is measured in years, not sprints.

- Every component has: tests (unit + interaction), a docs page, a visual example, and a changelog entry. No exceptions.
- Public APIs follow **semver strictly**. Breaking changes are batched into major releases with codemods.
- Internal utilities are ruthlessly deduplicated — `cn`, polymorphic types, variant helpers live in one place.
- We prefer **boring, proven dependencies** (Radix, Motion, Tailwind, Lucide) over trendy ones. Every dep is a future migration.
- Dead code, unused variants, and "just in case" abstractions are deleted on sight.

**Rule:** Write it so the next maintainer — including future-you — can understand it in one read.

---

## 10. Progressive Enhancement

Components work at the lowest capability level, then get better.

- Base HTML semantics work without JS: buttons submit, links navigate, forms post.
- JavaScript enhances — it does not enable. A `<Button>` is a `<button>` first, an animated interactive surface second.
- Server rendering produces the correct visual result before hydration. No flashes, no layout shift, no "loading…" for static content.
- Advanced features (command palette, virtualized tables, complex overlays) degrade gracefully when portals, `IntersectionObserver`, or `ResizeObserver` are unavailable.
- We assume slow networks, old devices, and users who disable animations, JavaScript, or third-party cookies.

**Rule:** The component must be useful before the fancy parts load.

---

## Applying These Principles

When designing or reviewing a component, ask — in this order:

1. **Is it accessible?** If no, stop.
2. **Does the default look production-ready?** If no, tune the system, not the component.
3. **Can it be smaller?** Split it into composable parts.
4. **Does it cost performance?** Measure before shipping.
5. **Can a prop be removed?** Remove it.
6. **Does the motion mean something?** If no, delete it.
7. **Does it reference tokens, not values?** If no, refactor.
8. **Can a developer use it without the docs?** If no, rename it.
9. **Will this still make sense in 3 years?** If no, redesign it.
10. **Does it work before JS loads?** If no, justify why.

If a component satisfies all ten, it belongs in Novix UI.
If it satisfies nine, it doesn't ship yet.

---

*This document is versioned with the library. Amendments require the same review rigor as a breaking API change.*
