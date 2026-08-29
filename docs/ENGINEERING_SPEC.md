# Novix UI — Engineering Specification

> The engineering handbook. Every component Novix UI ships — today and ten
> years from now — is built, reviewed, tested, documented, versioned, and
> maintained under the rules in this document. If a rule here conflicts with
> a component in flight, this document wins; the component changes.

Status: Canonical · Version: 1.0 · Owner: Novix UI Engineering Council
Companion docs (source of truth for their domains):
- `DESIGN_LANGUAGE.md` — visual, motion, and interaction language
- `API_PHILOSOPHY.md` — prop vocabulary and shared type contract
- `COMPONENT_SPECIFICATION.md` — the per-component spec template
- `TESTING_STRATEGY.md` — the nine testing layers
- `DOCUMENTATION_STANDARDS.md` — the 14-section docs template
- `ROADMAP.md` — release scope
- `CLI_ROADMAP.md` — tooling surface
- `THEME_GENERATOR.md` — theming pipeline

This handbook is procedural. When it says "must," a PR that violates it is
not merged; a component that violates it is not promoted.

---

## Part I — Component Architecture

### 1. Folder Structure

Each component lives in a self-contained folder under `packages/ui/src/`:

```
button/
  index.ts                       # public barrel: only stable exports
  button.tsx                     # the root component
  button.parts.tsx               # compound parts (Button.Icon, Button.Group)
  button.context.ts              # component-scoped React context (if any)
  button.slots.ts                # slot recipe (variants × sizes × states)
  button.types.ts                # public types (props, variants, refs)
  button.a11y.ts                 # a11y contract: roles, aria, keys
  button.motion.ts               # motion tokens and variants (if any)
  button.utils.ts                # component-only helpers, no exports
  __tests__/
    button.unit.test.tsx
    button.a11y.test.tsx
    button.interaction.test.tsx
    button.visual.test.tsx       # Playwright snapshot
    button.perf.test.tsx         # render counts, bundle probe
  __fixtures__/                  # deterministic data for tests
  __stories__/
    button.stories.tsx           # Ladle/Storybook stories
  docs/
    button.mdx                   # the docs page (14 sections)
    examples/                    # runnable code snippets imported by the MDX
```

Rules:
- **No file appears outside its folder.** Cross-component reach is via
  `index.ts` public exports, never deep imports.
- **`internal/` is off-limits externally.** Anything not re-exported from a
  component's `index.ts` is private; `nova lint` enforces this.
- **One component per folder.** A "family" (Menu with MenuItem, MenuGroup…)
  is one folder; siblings live in `.parts.tsx`.

### 2. File Naming

- `kebab-case` filenames; `PascalCase` component identifiers; `camelCase`
  everything else.
- Test files end in `.test.tsx`; visual snapshots in `.visual.test.tsx`;
  perf probes in `.perf.test.tsx`.
- No `Component.tsx` capitalized names, no `index.tsx` for a component root
  (only barrels are `index.ts`).

### 3. Export Strategy

- **Barrels are curated, not automatic.** `packages/ui/src/index.ts`
  re-exports only stable, documented public API. Experimental/alpha
  components are exported from `@novix-ui/react/unstable`.
- **Named exports only.** No default exports anywhere in `packages/ui`.
- **Types travel with values.** Every exported component exports its `Props`,
  `Ref`, and `Variants` types under a predictable name
  (`ButtonProps`, `ButtonRef`, `ButtonVariants`).
- **Side-effect-free modules.** No top-level `document`/`window` access, no
  registrations at import time. `package.json` sets `"sideEffects": false`.

### 4. Composition Rules

- **Compose, don't configure.** Prefer three small components over one
  component with fifteen booleans.
- **A component that has children with distinct roles ships as a compound.**
  `Card` has `Card.Header`, `Card.Body`, `Card.Footer`; `Menu` has
  `Menu.Trigger`, `Menu.Content`, `Menu.Item`, etc.
- **No prop-driven layouts.** Content order and grouping is controlled by
  JSX, not by props like `headerFirst={true}`.
- **`asChild` is the composition escape hatch** (see §9). Every wrapper
  component that renders a real DOM element supports it.

### 5. Slot Architecture

Every component declares its slots explicitly and documents them.

- A **slot** is a named, styleable subtree: `root`, `trigger`, `content`,
  `label`, `icon`, `indicator`, `input`, `affix-start`, `affix-end`.
- Slots are emitted as DOM with a **`data-slot="…"`** attribute so users can
  target styles without probing DOM structure.
- The `slots` prop accepts partial overrides: `slots={{ icon: MyIcon }}`.
- The `slotProps` prop accepts prop bags per slot:
  `slotProps={{ content: { className: '…' } }}`.
- Slots are **listed in `.types.ts`** as a union; adding a slot is a minor;
  removing or renaming one is a major.

### 6. Compound Components

- Compound parts are attached to the root as static properties
  (`Menu.Item`, `Menu.Content`). They also export as named exports
  (`export const MenuItem`) so tree-shaking and RSC boundaries stay clean.
- Parts read shared state from a **module-scoped React context** created in
  `.context.ts`. Contexts are namespaced (`useMenuContext()`), throw a
  descriptive error if used outside their provider, and are **not exported**
  publicly.
- Parts that render outside their provider (e.g. Portals) forward context
  explicitly; never rely on ambient globals.

### 7. Controlled vs Uncontrolled

- Every stateful component supports **both** modes.
- Controlled: `value` + `onValueChange` (or the domain-appropriate names —
  `open`/`onOpenChange`, `selectedKeys`/`onSelectionChange`).
- Uncontrolled: `defaultValue` (`defaultOpen`, `defaultSelectedKeys`) with
  an internal state hook.
- **Never both simultaneously.** Passing both throws in development and
  logs a one-time warning in production.
- Change handlers fire **only on user intent**, not on programmatic updates
  from the parent.

### 8. Ref Forwarding

- Every component forwards a ref to its **root DOM element** unless a more
  useful target exists (e.g. `Input` forwards to the `<input>`, not the
  wrapper). The target is documented in the props table.
- Compound parts forward refs individually.
- `useImperativeHandle` is allowed only when the component genuinely needs a
  method surface (focus management, media control); the imperative API is
  typed, documented, and part of the versioning contract.

### 9. Polymorphic Components (`asChild` / `as`)

- Nova uses the **`asChild`** pattern (Radix-style), not `as={"a"}`. `asChild`
  merges props and refs into the single child element via a `Slot` primitive
  from `@novix-ui/utils`.
- Rules:
  - The child must be a single React element.
  - Nova merges `className`, `style`, event handlers (chained, not
    overridden), and refs.
  - `asChild` on a component that renders more than one root element is a
    type error (enforced by the shared `Polymorphic` type).
- No component invents its own polymorphism.

### 10. Context Usage

- Context is a **last resort**, not a first tool. Use props, then compound
  parts, then context.
- One context per component, created by a `createContext<T | null>(null)`
  + `useX()` helper that throws if `null`.
- Context values are **stable references**: memoized objects, callbacks
  wrapped in `useEvent`/`useCallback` with stable deps. No new object per
  render.
- Context selectors: for context with many consumers where only some fields
  change, expose a selector helper (`useMenuState(s => s.open)`) implemented
  with `use-context-selector` or an equivalent, not with raw `useContext`.

### 11. Variant Strategy

- Variants are declared in `.slots.ts` using a **recipe** function
  (`sva`-style: variants × compoundVariants × defaultVariants).
- Variants are **enumerated**, not open strings. `variant` is a discriminated
  union, not `string`.
- Variant prop names are shared across the library (see `API_PHILOSOPHY.md`):
  `variant`, `size`, `tone`, `radius`, `density`.
- **Never** encode variants as booleans (`isPrimary`, `isLarge`). Use the
  shared enum.

### 12. State Management

- Component-local state uses React state hooks. No external stores inside
  `packages/ui`.
- Cross-part state uses component context (§10).
- App-wide state (theme, direction, motion preference, portal container) is
  provided by `NovaProvider` and consumed via typed hooks
  (`useTheme`, `useDirection`, `useReducedMotion`, `usePortalContainer`).
- **State machines** (`@xstate/store` or a lightweight internal reducer) are
  required whenever a component has ≥3 states with non-trivial transitions
  (dialogs, comboboxes, popovers, toasts). Transitions are enumerated and
  tested exhaustively.

### 13. Internal Utilities

- Shared low-level helpers live in `@novix-ui/utils` (side-effect-free,
  exhaustively tested, semver-locked). Examples: `cn`, `Slot`, `mergeProps`,
  `useEvent`, `useControllableState`, `useComposedRefs`, `useId`,
  `usePrevious`, `useSafeLayoutEffect`.
- Component-private helpers live in `component.utils.ts` and are never
  exported.
- **No lodash.** No moment. Use the platform.

### 14. Animation Integration

- Motion tokens and variants live in `component.motion.ts` and consume the
  Nova motion system (`--motion-duration-*`, spring presets).
- `motion` (formerly Framer Motion) is the sole animation library. Direct
  DOM animation APIs are permitted only for the Nova Loading Bar and page-
  chrome effects.
- Every animation:
  - runs on **compositor-only properties** (`transform`, `opacity`,
    `filter`);
  - has a **reduced-motion counterpart** designed at the same time (see §21);
  - is opt-outable via `motionPreset="none"` or the shared `motion` prop.
- Layout animations (`layoutId`, `layout`) require an explicit review — they
  are expensive and easy to misuse.

### 15. Theme Integration

- Components style themselves **only** through semantic CSS variables from
  `@novix-ui/tokens`. No hex, no rgb, no hsl, no `oklch(…)` literals inside
  component files. `nova lint` enforces this.
- Component-specific tokens are computed from alias tokens in
  `packages/tokens`, not defined ad hoc. Naming:
  `--<component>-<slot>-<property>-<state>` (e.g. `--button-primary-bg-hover`).
- Adding a new alias token is an RFC (see §41). Adding a component token is
  a PR.

### 16. Accessibility Integration

- Every component declares its a11y contract in `component.a11y.ts`:
  role(s), required ARIA attributes, keyboard map, focus behavior, live
  region usage, RTL notes.
- Radix primitives are the default substrate for anything with non-trivial
  a11y (dialog, popover, menu, tooltip, listbox). Nova adds visual language
  on top; it does not re-implement focus traps, roving tab index, or type-
  ahead unless there is a concrete engineering reason (documented in the
  component's ADR — see §41).

---

## Part II — Component API Standard

Full vocabulary lives in `API_PHILOSOPHY.md`. This section codifies the
engineering contract around it.

### 17. Shared Props (applied when the concept exists)

| Prop | Type | Notes |
|---|---|---|
| `variant` | enum | Visual family; never boolean |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | Not all sizes required; document available |
| `tone` | enum | Semantic color role (`neutral`, `brand`, `success`, `warn`, `danger`, `info`) |
| `radius` | enum | `"none" \| "sm" \| "md" \| "lg" \| "full"` |
| `density` | enum | Inherited from `NovaProvider`; overridable per component |
| `loading` | boolean | Adds pending affix, disables interaction, announces via aria-busy |
| `disabled` | boolean | Non-interactive; still focusable if the a11y contract requires |
| `readOnly` | boolean | Displays value, blocks edit, remains focusable |
| `invalid` | boolean | Sets `aria-invalid`, applies error visuals |
| `required` | boolean | Sets `aria-required` and connects to form validation |
| `icon` | ReactNode | Sole visual, used with icon-only variants |
| `leftIcon` / `rightIcon` | ReactNode | Adornments; spacing handled by the component |
| `startSlot` / `endSlot` | ReactNode | Structural slots for complex components |
| `asChild` | boolean | Polymorphism (§9) |
| `className` | string | Merged via `cn`; component owns tokens, user owns overrides |
| `style` | CSSProperties | Escape hatch; discouraged in favor of tokens |
| `slots` | Partial<Record<SlotName, ComponentType>> | Component substitution |
| `slotProps` | Partial<Record<SlotName, object>> | Prop injection per slot |
| `motionPreset` | enum | `"default" \| "subtle" \| "none"` |
| `ref` | Ref<Element> | Points at the documented root element |
| `data-*` | string | Reserved: `data-slot`, `data-state`, `data-orientation`, `data-side`, `data-align`, `data-disabled`, `data-loading` |
| `aria-*` | ARIA attributes | Passed through to the correct DOM node |

### 18. Rules of the Vocabulary

- **A prop with the same name must have the same meaning across every
  component.** If a component needs a different meaning, it uses a
  different name.
- **Booleans are non-exclusive.** `disabled + loading` is legal; `variant`
  and `tone` are orthogonal.
- **Every enum is exhaustive at the type level.** No `string` fallbacks.
- **Callbacks are named `onXChange` for value-like state, `onX` for events.**
  `onOpenChange`, `onValueChange`, `onSelectionChange`; `onClick`,
  `onSubmit`, `onDismiss`.
- **Change handlers receive typed payloads**, not `Event` objects, unless
  the event object is genuinely needed.
- **`children` beats `label` beats `title`.** If the component renders
  arbitrary content, it takes `children`; if it takes a plain string, `label`
  or `title` per the domain.

### 19. Data Attributes Contract

Every visible interactive component emits at least:
- `data-slot` on every slot
- `data-state` reflecting the primary state machine (`open`, `closed`,
  `checked`, `indeterminate`, `loading`, `pending`, `success`, `error`)
- `data-disabled`, `data-loading`, `data-invalid` when the corresponding
  prop is true

Users style states with `data-*` selectors. Components must not require
class-based state hooks.

### 20. Forbidden Patterns (blocked by lint / review)

- Prop names that duplicate concepts under different names
  (`isDisabled` + `disabled`).
- `type` used for variant (`type="primary"`); `type` is reserved for HTML
  semantics (`type="submit"`).
- Style objects with hard-coded colors, radii, or shadows.
- Boolean explosions replacing enums (`primary`, `secondary`, `danger` as
  separate booleans).
- Uncontrolled DOM refs escaping the component.
- Callbacks that fire from programmatic state changes.

---

## Part III — Accessibility Standard

### 21. Baseline Requirements

Every component ships meeting **WCAG 2.2 AA** at minimum, AAA where
practical (contrast on primary text, focus visibility).

- **Semantic HTML first.** `<button>` for buttons, `<a>` for links,
  `<label>` for labels. Custom roles only when no native element fits.
- **ARIA is applied by the component**, not by the consumer. Consumers pass
  `aria-label`/`aria-describedby` only when supplying custom content.
- **All interactive elements are reachable by keyboard**, operable without a
  pointer, and expose a visible focus state (the Nova Ring).
- **Focus order** follows visual order. `tabIndex > 0` is banned.
- **Focus is trapped and restored** by any component that opens a modal
  layer (Dialog, Sheet, Popover-with-modal, Command). Restoration is to the
  triggering element unless the DOM has changed, in which case a
  documented fallback applies.
- **Screen-reader parity:** every visual state has a semantic equivalent.
  Loading uses `aria-busy`; validation uses `aria-invalid` +
  `aria-describedby`; live regions announce async status.
- **Reduced motion:** `prefers-reduced-motion: reduce` disables non-
  essential animation; essential motion (progress, streaming) is retained
  but slowed and de-parallaxed.
- **Reduced transparency and forced-colors** are supported: components
  avoid meaning-carrying transparency and declare system-color fallbacks.
- **Contrast** is validated by the token system; component-level overrides
  that break contrast fail lint.
- **Touch targets** are ≥44×44 CSS px on any surface that may accept touch.
  Visual hit areas may be smaller if the interactive box remains ≥44.
- **RTL** is supported natively via logical properties (`padding-inline`,
  `margin-inline-start`), `dir` propagation from `NovaProvider`, and
  mirrored icons where meaning is directional (chevrons, arrows,
  breadcrumbs).
- **Localization:** all component-authored strings (aria labels, default
  messages) are sourced from a locale table; consumers can override per
  component (`labels={{ close: '…' }}`) or globally through `NovaProvider`.
  Number, date, and unit formatting uses `Intl` APIs.
- **Announcements** for async success/error use polite live regions by
  default; only critical errors use assertive.

### 22. Accessibility Checklist (blocks release)

- [ ] Every interactive slot has a role and an accessible name.
- [ ] Keyboard map documented in `.a11y.ts` and verified by tests.
- [ ] Focus visible in light, dark, and forced-colors modes.
- [ ] `axe-core` clean on the component's Storybook page (zero violations,
      zero incomplete after review).
- [ ] Screen-reader script recorded (VoiceOver + macOS Safari, NVDA +
      Windows Firefox, TalkBack + Chrome) and archived with the release.
- [ ] Reduced-motion variant designed, implemented, and snapshotted.
- [ ] RTL snapshot passes.
- [ ] Localization strings extracted; English fallback documented.

---

## Part IV — Performance Standard

### 23. Bundle & Distribution

- Package is **ESM-only**, `type: "module"`, targets modern browsers
  (Chrome 111, Safari 16.4, Firefox 128 baseline).
- `sideEffects: false`; every barrel is import-safe for tree-shaking.
- Each component is **individually importable**:
  `import { Button } from '@novix-ui/react/button'`. The root barrel is
  provided for DX but pays no runtime cost when tree-shaken.
- **Bundle budgets** (gzipped, per component in isolation, measured in CI):
  - Primitive (Button, Badge, Separator): ≤ 2KB
  - Interactive (Input, Menu, Tooltip): ≤ 5KB
  - Complex (Combobox, Dialog, DataTable row): ≤ 12KB
  - Composite (Command, DataTable core): ≤ 25KB
- Exceeding a budget requires a PR-linked ADR.

### 24. SSR & RSC

- Every component is SSR-safe: no `window`/`document` at module scope, no
  layout-effect-only rendering paths.
- **Server Components:** presentational primitives with no interactivity
  (Card, Badge, Separator, Skeleton, layout components) are RSC-compatible
  and ship without `"use client"`. Interactive components ship with
  `"use client"` at the top of the client-only entry.
- SSR HTML matches first client render — no hydration warnings. Any
  client-only content (portals, resize-driven layouts) uses a
  `useHydrated()` gate or a component-local `ClientOnly` boundary.
- **Streaming:** components that render lists or async content are
  compatible with React Suspense and `renderToPipeableStream`.

### 25. Hydration & Interactivity

- **Zero-JS by default** for presentational components; the framework
  should be able to render them without any client bundle.
- Interactive components hydrate incrementally where the host framework
  supports it (islands, RSC, `use client` boundaries).
- No `useLayoutEffect` on the SSR path; use `useSafeLayoutEffect`
  (an alias that becomes `useEffect` on the server).

### 26. Rendering Performance

- Components memoize expensive computations (`useMemo`) and stable
  callbacks (`useEvent`/`useCallback`). Cheap components are **not**
  wrapped in `memo` reflexively — memoization is justified per case.
- Context values are always stable references (§10).
- Lists render **windowed** past 100 items (Combobox options, Menu items,
  Table rows). The virtualization strategy is component-owned; consumers
  don't wire it manually.
- No re-render should occur in response to a state change that does not
  affect a component's own output (verified by a `perf.test.tsx` render-
  count probe).
- Style recalcs during animation are prohibited; only `transform`, `opacity`,
  and `filter` change during motion.
- Every animation is verified at 60fps on a mid-range laptop; CI runs a
  Lighthouse-style budget for the docs demo pages.

### 27. Caching & Data

- Components do not fetch data. Data hooks live in host apps.
- Deferred UI (skeletons, spinners) is provided by Nova; the loading
  contract is the shared `loading` prop plus `data-loading` and
  `aria-busy`.

---

## Part V — Testing Standard

Full strategy: `TESTING_STRATEGY.md`. Here we codify the per-component
minimum.

### 28. Required Tests per Component

1. **Unit** — variants render, props pass through, refs forward,
   controlled/uncontrolled parity.
2. **Integration** — interactions with sibling components (e.g. Form +
   Input + Error) if the component is meant to compose.
3. **Accessibility** — `axe-core` on every variant permutation snapshot;
   keyboard map exhaustively exercised; focus restoration verified;
   screen-reader announcements asserted with `@testing-library` a11y
   queries.
4. **Interaction** — user flows via `@testing-library/user-event`; state
   machine transitions exhaustively covered.
5. **Visual regression** — Playwright snapshots of the component gallery
   (all variants × sizes × states, in light, dark, forced-colors, and RTL).
6. **Cross-browser** — Playwright matrix (Chromium, WebKit, Firefox) for
   any component that draws, focuses, portals, or animates.
7. **Performance** — render-count probe; bundle-size probe; motion FPS
   probe for animated components.
8. **Contract** — snapshot of the public types
   (`api-extractor`/`arethetypeswrong`) fails the build on drift.

### 29. Coverage Requirements

- **Statements ≥ 95%**, branches ≥ 90%, functions 100% for public API.
- Coverage is a **secondary metric**. Uncovered lines flagged by review
  must have a stated reason or new tests.

### 30. Release Checklist per Component

- [ ] All required tests present and passing on CI matrix.
- [ ] `axe-core` clean; a11y checklist (§22) complete.
- [ ] Bundle budget (§23) met.
- [ ] Docs page (§31) complete with all 14 sections.
- [ ] Types public API snapshot updated and reviewed.
- [ ] Changelog entry with semver classification.
- [ ] Two Council reviewers approved.
- [ ] Design Language Compliance sign-off from a Design Council member.

---

## Part VI — Documentation Standard

Every component's `docs/component.mdx` contains, in order:

1. **Overview** — one-paragraph purpose statement and the primary emotion
   from the Emotional Design Matrix (`DESIGN_LANGUAGE.md` Part IV).
2. **Live Preview** — the archetypal example, rendered.
3. **Interactive Playground** — every public prop wired to a control.
4. **Installation** — `nova add <component>` and the manual import path.
5. **Usage** — the copy-pasteable minimal example.
6. **Variants** — a grid of every variant × size × tone.
7. **Accessibility** — role, ARIA, focus, screen-reader behavior.
8. **Keyboard Support** — table of key → action, matching `.a11y.ts`.
9. **Examples** — real-world compositions (in a form, in a table, with
   AI streaming, etc.).
10. **Props Table** — auto-generated from `.types.ts` at build time.
11. **Best Practices** — three to five bullets, prescriptive.
12. **Common Mistakes** — three to five anti-patterns with side-by-side
    do/don't code.
13. **Performance Notes** — bundle size, virtualization thresholds, when
    to memoize consumers.
14. **Migration Notes & Related Components** — links to codemods, adjacent
    components, and RFCs.

Docs must build with zero warnings, be indexed for search, and pass
`nova lint --docs` before merge. The docs site itself is Nova-branded and
consumes only Novix UI components — dogfooding is mandatory.

---

## Part VII — Quality Gates

A component moves through six gates before it becomes **Stable**. Each gate
is binary and reviewed by a specific role.

| Gate | Reviewer | Passing criteria |
|---|---|---|
| **Design Language Compliance** | Design Council | Follows `DESIGN_LANGUAGE.md`; uses only tokens; motion tokens applied; screenshot test passed |
| **API Consistency** | API Steward | Vocabulary (§17) applied; no forbidden patterns (§20); public types diff reviewed |
| **Accessibility** | A11y Owner | Checklist (§22) complete; SR script archived |
| **Performance** | Performance Owner | Budgets (§23) met; render-count probe passing; motion at 60fps |
| **Testing** | Testing Owner | All required tests (§28) present; coverage thresholds met |
| **Documentation** | Docs Owner | All 14 sections present; playground works; examples run |
| **Engineering Review** | Two Council Engineers | Code review approved; ADR present for any exception; changelog entered |

No gate can be waived. Waivers require a Council vote recorded in an ADR.

---

## Part VIII — Versioning

Novix UI follows **semantic versioning** at the package level and a
**maturity ladder** at the component level.

### 31. Component Maturity Ladder

| Stage | Import path | Guarantees | Promotion requires |
|---|---|---|---|
| **Experimental** | `@novix-ui/react/experimental` | None; API may change without notice | Council green-light to enter |
| **Alpha** | `@novix-ui/react/unstable` | API breaks only on minor | Full test suite passes; a11y basics; usable docs |
| **Beta** | `@novix-ui/react/unstable` (flagged `beta`) | API breaks only on major; deprecations only on minor | All required tests (§28); a11y checklist (§22); performance budgets (§23) |
| **Stable** | `@novix-ui/react` | Full semver; all quality gates (§Part VII) | All six gates passed |
| **Deprecated** | as installed | Still shipped; emits a build-time warning; codemod available | Documented replacement; migration guide |
| **Removed** | — | Not shipped | One full major of Deprecated first |

Rules:
- Promotion is a PR that flips the stage in the component's manifest and
  updates the barrel; reviewed as any other change.
- Demotion (Stable → Deprecated) requires a Council vote and a codemod.
- No component skips a stage.

### 32. Package Semver

- **Major** — breaking public API change, token rename, removed component,
  Node/React baseline bump.
- **Minor** — new component, new prop, new slot, new token alias,
  deprecation (never removal).
- **Patch** — bug fix, docs, non-breaking style refinement inside token
  budgets.
- Changelogs are generated from PR labels; every PR ships with a
  `changeset` entry.

### 33. Deprecation Policy

- Deprecation lands in a **minor** with a runtime warning (dev only), a
  build-time warning (via lint), and a documented replacement.
- Removal lands no sooner than **the next major after** deprecation. So a
  deprecation in 1.4 may be removed in 2.0 (if that ships after 1.5+), never
  earlier.
- Every deprecation ships with a **codemod** runnable via `nova upgrade`.

---

## Part IX — Contribution Rules

### 34. RFCs

Any change that is **cross-component**, **API-shaped**, or **irreversible**
requires an RFC before implementation. Examples: new shared prop, new alias
token, new lifecycle hook, new context on `NovaProvider`, removal of a
component.

RFC lifecycle:
1. **Draft** in `rfcs/NNNN-title.md`, PR opened.
2. **Discussion** ≥7 calendar days, open to the public.
3. **Council review**: accept, revise, or decline. Decision recorded in the
   RFC.
4. **Merged** RFCs become the source of truth for the implementation PRs
   that follow.

### 35. Component ADRs

Each component folder contains `adr/` with numbered decisions
(`0001-why-radix-substrate.md`). ADRs capture *why*, not *what*. They are
required whenever a component:
- deviates from a shared rule in this document,
- picks between two viable approaches,
- adopts a dependency,
- makes an accessibility trade-off.

### 36. Creating a Component

1. **Propose:** open an issue with the problem the component solves. Search
   for prior discussions.
2. **Specify:** fill in `COMPONENT_SPECIFICATION.md` for the component.
   Confirm the design exists in the Figma library.
3. **Scaffold:** `nova generate component <Name>` produces the folder
   skeleton (§1).
4. **Build to Alpha:** implement enough to pass the a11y basics and unit
   tests. Merge behind the `unstable` barrel.
5. **Iterate to Beta:** complete required tests, a11y, and performance.
6. **Promote to Stable:** pass all six quality gates (Part VII).

### 37. Reviewing a Component

Reviewers use the **Component Review Checklist** (mirrored in the PR
template):
- Design Language Compliance
- API Consistency (§17–§20)
- Accessibility (§21–§22)
- Performance (§23–§27)
- Tests (§28–§29)
- Docs (§31)
- Types public-API diff reviewed
- Changelog entry present
- ADR present if any deviation

At least two Council reviewers must approve. The Design Council reviewer
must approve any visual change.

### 38. Testing a Component

- Write the test **before or with** the implementation, not after.
- Tests describe **behavior**, not implementation. Query by role, not by
  class.
- No fake timers unless the component owns timing.
- Flake budget: zero. A flaky test blocks its component's promotion.

### 39. Documenting a Component

- Docs are written **with** the component, not after.
- Every example in docs is **runnable**. Broken examples fail CI.
- Copy voice: precise, human, dry wit (`DESIGN_LANGUAGE.md` §2).

### 40. Maintaining a Component

- Each component has a **CODEOWNER** — a Council member who owns triage.
- Issues are labeled by component; CODEOWNERS auto-assigned.
- Critical bugs (data loss, a11y regression, crash) receive a patch within
  72 hours; non-critical within one minor release.
- Every quarter, each Stable component is re-audited against the current
  version of this document (the **Design Constant check**). Drift is
  logged as an issue.

### 41. Governance

- The **Engineering Council** owns this document and merges changes to it.
- The **Design Council** owns `DESIGN_LANGUAGE.md`; changes there that
  affect engineering are cross-reviewed.
- The **A11y Owner**, **Performance Owner**, **Testing Owner**, **Docs
  Owner**, and **API Steward** are named roles held by Council members;
  they own their respective quality gates.
- Council decisions are recorded in ADRs. Nothing important is decided in
  chat.

### 42. Cadence

- **Weekly:** triage; PR review; release train (patch as needed).
- **Bi-weekly:** minor release window.
- **Quarterly:** Design Constant check; RFC retrospective; roadmap
  update.
- **Annually:** major release window; deprecation sweep.

---

## Part X — Definitions & Non-Goals

### Definitions

- **Component** — a public export from `@novix-ui/react` with a folder
  under `packages/ui/src/`.
- **Primitive** — a component with no compound parts and no context.
- **Composite** — a compound component with shared state.
- **Slot** — a named, styleable subtree with a `data-slot` attribute.
- **Token** — a value in `@novix-ui/tokens`; the only currency components
  spend on styling.
- **ADR** — Architecture Decision Record.
- **RFC** — Request for Comments; a proposal that changes shared surface.
- **Council** — the maintainers who own this document and merge changes to
  it.

### Non-Goals

- Not a component per Figma layer. Design proposes; engineering ships when
  the case is proven.
- Not a "flexible" library that solves every problem. Novix UI is
  opinionated by design.
- Not a place for personal style. Contributions align with the language
  and the vocabulary; personal preference is respected in *how* the work is
  done, not in *what* is done.
- Not a promise of forever-backwards-compatibility. Nova evolves; it
  provides codemods and honest deprecation windows, not stasis.

---

## Part XI — The Engineering Oath

> Build only what earns its place in the barrel.
> Test what a user can do, not what your code happens to be.
> Ship a11y as the default, never as a mode.
> Spend bytes like money and milliseconds like sleep.
> Deprecate honestly and migrate for the user.
> Leave every component better than you found it, or leave it alone.
