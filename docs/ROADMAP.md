# Novix UI — Release Roadmap

> A ten-release path from foundation to v1.0.
> Every release has one objective, a bounded component scope, and a clear definition of done.

This roadmap is versioned with the library. It is the operational companion to the [Design Principles](./DESIGN_PRINCIPLES.md), the [Universal Component Specification](./COMPONENT_SPECIFICATION.md), and the [API Philosophy](./API_PHILOSOPHY.md).

Rules:

- **One theme per release.** No release ships components from more than one layer of the stack.
- **Every component follows the Universal Component Specification without exception** — spec, tests, docs, a11y audit, visual regression.
- **Every component conforms to the API Philosophy** — no invented props, canonical surface only.
- **A release ships only when its "Definition of Done" is fully green.** Slipping scope out is preferred to slipping quality.
- **Semver applies from v0.1.** Minor versions may break APIs (documented + codemod); patches never do.

---

## Release-at-a-Glance

| Version | Theme | Status |
|---------|-------|--------|
| **v0.1** | Foundation Layer | ✅ Shipped |
| **v0.2** | Form Primitives | ✅ Shipped (Textarea, Select, Combobox, Checkbox, Radio, Switch, Slider, Label, FormField, PinInput, DatePicker, TimePicker, ColorPicker, FileUpload) |
| **v0.3** | Overlays & Portals | ✅ Shipped (Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu, Menubar, Toast) |
| **v0.4** | Navigation & Structure | ✅ Shipped (Tabs, Accordion, NavigationMenu, Pagination, Breadcrumb via Layout, Stepper, Steps, Timeline, Tree, ScrollArea) |
| **v0.5** | Feedback & Status | ✅ Shipped (Alert, Progress, ProgressCircle, Skeleton, Spinner, Status, Announcement, EmptyState) |
| **v0.6** | Data Display | ✅ Shipped (Table, Statistic, Rating, Calendar, AspectRatio, Snippet, Marquee, Ticker, Comparison, Cursor) |
| **v0.7** | SaaS Specials + Elements Gallery | ✅ Shipped — see [Elements Gallery](./components/ELEMENTS_GALLERY.md) (1,000+ premium animated variants across 11 categories) |
| **v0.8** | AI Surfaces | Planned |
| **v0.9** | Templates, CLI & Polish | 🚧 In progress — `/design` service-site generator + ZIP export, `@novix-ui/cli` scaffolded, Storybook + parity tests live |
| **v1.0** | Stability, Semver & Launch | Planned |

---

## v0.1 — Foundation Layer ✅

**Objective:** Establish the design system, motion language, theming, and the five primitives every other component depends on.

**Scope:**

- Design tokens (OKLCH, semantic, light/dark) in `src/styles.css` mirrored to TypeScript.
- Theme system (`ThemeProvider`, light / dark / system, persistence).
- Motion presets (`snap`, `soft`, `glide`) via Motion.
- Utility layer (`cn`, polymorphic types, shared base interfaces).
- Icon system wrapper around `lucide-react`.
- Components: **Button**, **Input**, **Card**, **Badge**, **Separator**.
- Docs shell (landing page + component gallery, SEO metadata, sitemap/robots).

**Definition of Done:**

- Foundation reviewed, typechecked, and stabilized.
- No further foundation churn expected before v1.0.
- All five components fully spec-compliant (a11y, tests, docs, visual regression).

---

## v0.2 — Form Primitives

**Objective:** Complete the form surface so a developer can build any real product form using Novix UI alone, with correct validation, focus, and accessibility semantics.

**Scope:**

- **Textarea** — auto-resize, character counter slot, invalid/loading states.
- **Select** — Radix-backed, typeahead, keyboard nav, size parity with Input.
- **Combobox** — filterable Select, async loading, empty state, virtualization ready.
- **Checkbox** — controlled/uncontrolled, indeterminate, label composition.
- **Radio / RadioGroup** — full keyboard model, horizontal & vertical orientation.
- **Switch** — labeled variant, size scale, motion via `snap`.
- **Slider** — single & range, keyboard steps, `min`/`max`/`step`.
- **Label** — with `htmlFor` inference, required indicator.
- **FormField** — composition wrapper wiring label, hint, error, and control via `useId`.

**Definition of Done:**

- All form controls share identical size, radius, focus-ring, and disabled treatments.
- Keyboard model verified against WAI-ARIA APG.
- Docs include a full "Realistic Form" example (settings page + validation).
- Axe-core: zero violations across every variant × state × theme.

---

## v0.3 — Overlays & Portals

**Objective:** Deliver the layered UI primitives — the components that appear *above* the page and demand rigorous focus management.

**Scope:**

- **Dialog** — modal & non-modal, sizes, controlled/uncontrolled, nested.
- **Drawer / Sheet** — side + bottom, mobile-first, drag-to-dismiss on touch.
- **Popover** — Radix-positioned, arrow, collision handling.
- **Tooltip** — delay group, keyboard-triggered, respects `prefers-reduced-motion`.
- **DropdownMenu** — nested, checkbox/radio items, keyboard shortcuts display.
- **ContextMenu** — right-click / long-press parity.
- **HoverCard** — for rich hover previews (users, links, cards).

**Definition of Done:**

- Focus trap, restore, and inert-background behavior verified across all overlays.
- Escape/click-outside/scroll-lock behavior consistent and documented.
- Portal SSR safety: no hydration mismatches, no `window` at module scope.
- Motion presets applied uniformly (`soft` for enter/exit, `snap` for menus).

---

## v0.4 — Navigation & Structure

**Objective:** Provide the structural components that hold a product together — the ones consumers reach for on every page.

**Scope:**

- **Tabs** — horizontal & vertical, keyboard model, animated indicator.
- **NavigationMenu** — top-level app nav with mega-menu support.
- **Breadcrumbs** — with overflow collapse.
- **Pagination** — page numbers, prev/next, sibling/boundary counts.
- **Accordion** — single & multiple, animated content height.
- **Collapsible** — primitive underlying Accordion.
- **ScrollArea** — themed scrollbars, hover reveal.
- **Sidebar** — collapsible app shell with keyboard toggle, mobile drawer variant.
- **Toolbar** — grouped controls with roving tabindex.

**Definition of Done:**

- All navigation components support RTL out of the box.
- Sidebar + top-nav shell wired into the docs site as the reference implementation.
- Keyboard walkthrough documented per component.
- Container queries used where genuinely responsive (Sidebar, NavigationMenu).

---

## v0.5 — Feedback & Status

**Objective:** Every component that tells the user *what just happened* or *what is happening right now*.

**Scope:**

- **Toast / Sonner-style notifier** — queue, positions, promise-based API, screen-reader `aria-live`.
- **Alert** — inline banner, solid/soft/outline tones, dismissible.
- **Banner** — page-level announcement bar.
- **Progress** — linear & indeterminate, labeled.
- **Spinner** — canonical loading indicator used across the library.
- **Skeleton** — shimmer, layout-preserving.
- **EmptyState** — illustration slot, title/description/action composition.
- **StatusDot** — semantic health indicator (already used in Badge, promoted to primitive).

**Definition of Done:**

- All async patterns (loading, empty, error) have first-class components — no ad-hoc solutions in docs.
- Toast queue handles reduced-motion and focus-preserving semantics correctly.
- Skeleton components match the layout of their real counterparts exactly.

---

## v0.6 — Data Display

**Objective:** The primitives dashboards are built on — dense, performant, accessible data surfaces.

**Scope:**

- **Table** — semantic `<table>` primitive, sticky header, zebra, density scale.
- **DataTable** — sortable columns, row selection, pagination, empty/loading/error states. Headless model (TanStack Table) with Nova styling.
- **Avatar** — image, initials fallback, presence indicator, group with overflow.
- **Tag / Chip** — removable, selectable, with leading avatar/icon.
- **Kbd** — keyboard shortcut display.
- **Code / Pre** — syntax-highlighted block with copy button.
- **Stat / KPI** — number, trend indicator, sparkline slot.
- **Timeline** — vertical, connector styles, dense variant.

**Definition of Done:**

- DataTable renders 10,000 rows without virtualization at < 16ms per interaction (INP budget).
- Table + DataTable spec includes a full "Users list" reference example.
- Copy-to-clipboard interactions announce success via `aria-live`.

---

## v0.7 — SaaS Specials

**Objective:** The components that make a SaaS product feel like a *product*, not a form builder.

**Scope:**

- **Command / CommandPalette** — Raycast-style, fuzzy search, groups, keyboard shortcuts, recent items.
- **Calendar** — single, range, multiple; keyboard model; locale-aware.
- **DatePicker / DateRangePicker** — Input + Popover + Calendar composition.
- **FileUpload / Dropzone** — drag-and-drop, progress, multi-file, accessible fallback.
- **Stepper / Wizard** — linear & non-linear, keyboard nav, state per step.
- **PricingCard** — canonical layout for billing tiers.
- **FeatureCallout** — new-feature announcement pattern.
- **SettingsRow** — label + description + control canonical layout.

**Definition of Done:**

- Command palette is embeddable in the docs site itself as the reference implementation.
- Calendar passes WAI-ARIA APG grid pattern conformance.
- FileUpload works without JavaScript for the base `<input type="file">` case.

---

## v0.8 — AI Surfaces

**Objective:** First-class primitives for AI-native product surfaces — the components that don't exist in Chakra, Material, or Ant.

**Scope:**

- **ChatMessage** — user/assistant/system variants, avatar slot, streaming indicator.
- **ChatComposer** — auto-resizing input, attachment slot, send/stop states.
- **StreamingText** — token-by-token rendering with cursor, respects reduced motion.
- **ToolCall** — collapsible tool invocation display with status.
- **CodeDiff** — inline & split, syntax-highlighted.
- **CitationList** — inline citation markers + expandable source list.
- **PromptSuggestion** — clickable prompt chips.
- **ModelPicker** — Combobox variant preconfigured for model selection.
- **TokenMeter** — usage indicator with warning thresholds.

**Definition of Done:**

- Streaming components render at 60fps for realistic token rates.
- Every AI surface has a "screen-reader friendly" mode — streaming text announces on chunk boundaries, not per token.
- Reference implementation: a full chat page built entirely from Nova AI primitives.

---

## v0.9 — Templates, CLI & Polish

**Objective:** Make Novix UI *pick-up-and-ship* fast. Turn the library into a system a startup can adopt on a Friday.

**Scope:**

- **CLI (`nova` command)** — `init`, `add <component>`, `diff`, `upgrade`. shadcn-style source-copying flow for teams that want to own components.
- **Templates** —
  - `saas-starter` (marketing + auth + dashboard shell).
  - `admin-dashboard` (sidebar + DataTable + settings).
  - `ai-chat` (chat page + composer + tool calls).
  - `docs-site` (Nova's own docs site as a template).
- **Icon Sets** — curated Lucide subsets, tree-shakeable per-category exports.
- **Blocks** — copy-paste layouts (hero, pricing, features, footer, auth forms).
- **Docs Polish** —
  - Search (Command palette integration).
  - Theme playground (live token editor).
  - Copy-code button on every example.
  - Storybook & Chromatic public builds.
- **Migration guides** — from shadcn, from Chakra, from Mantine.

**Definition of Done:**

- New project from `npx novix init <template>` → running dev server in under 60 seconds.
- All templates pass Lighthouse ≥ 95 on performance, accessibility, best practices, SEO.
- Docs site itself is the flagship template — dogfooded.

---

## v1.0 — Stability, Semver & Launch

**Objective:** Freeze the public API, commit to semver, and launch Novix UI publicly.

**Scope:**

- **API Freeze** — every public prop, subcomponent, and data-attribute audited against the API Philosophy. Any inconsistency is fixed with a codemod.
- **Semver Commitment** — from v1.0 onward: patch = bugfix, minor = additive, major = breaking with a full migration guide + codemod.
- **Deprecation Policy** — minimum two-minor-release notice for any removal; deprecations warn in dev, no-op in prod.
- **Performance Budget Enforcement** — bundle size, INP, CLS enforced in CI per component.
- **Accessibility Certification** — every component re-audited by a third party against WCAG 2.2 AA. Report published.
- **Long-Term Support** — v1.x supported for a minimum of 18 months with security & compatibility patches.
- **Launch** —
  - Public docs site at `novix-ui.dev` (or equivalent).
  - Announcement post, changelog, migration guides.
  - Open governance: RFC process, public roadmap, contribution guide.

**Definition of Done:**

- Zero known API inconsistencies across the library.
- Zero critical or serious axe-core violations across every component × variant × state × theme.
- Every component has a stable-status spec, complete docs, and a changelog entry.
- Bundle size, INP, and CLS budgets enforced in CI, blocking regressions.
- Third-party accessibility audit passed and published.

---

## Cross-Cutting Requirements (Every Release)

These apply to **every** release from v0.2 onward, not just v1.0:

- ✅ Every new component ships with a spec document (all 13 sections).
- ✅ Every new component follows the canonical API surface — no invented props.
- ✅ Every new component ships with unit + interaction + a11y + visual regression tests.
- ✅ Every new component ships with a docs page (overview, examples, API, variants gallery, do/don't, keyboard reference, related, changelog).
- ✅ No release regresses bundle size, INP, or CLS budgets.
- ✅ No release breaks a previously stable API without a codemod and migration guide.
- ✅ Dark mode is verified on every new component before merge.
- ✅ Reduced motion is verified on every new component before merge.
- ✅ RTL is verified on every new component before merge.

If a release cannot meet these, its scope shrinks. Quality is the constant.

---

## Version Numbering

- **v0.x** — pre-1.0. Minor bumps may include breaking changes, always with a codemod and one-release deprecation window.
- **v1.0+** — strict semver. No breaking changes outside major releases.
- **Release cadence** — roughly one minor release every 4–6 weeks. Patches as needed.
- **Release channels** — `latest` (stable), `next` (release candidates), `canary` (nightly, unsupported).

---

*This roadmap is versioned with the library. Scope changes require review at the level of a spec amendment.*
