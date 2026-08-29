# Novix UI — Testing Strategy

> Nine layers of testing. Every component satisfies every applicable layer before it ships to `stable`.
> Untested behavior does not exist as far as Novix UI is concerned.

This document is the source of truth for **how we prove Novix UI works**. It is the operational companion to the [Design Principles](./DESIGN_PRINCIPLES.md), the [Universal Component Specification](./COMPONENT_SPECIFICATION.md), and the [API Philosophy](./API_PHILOSOPHY.md).

Rules:

- Every component ships with tests covering **every layer that applies to it**.
- "It works on my machine" is not a signal. Green CI is.
- Flaky tests are treated as broken tests — quarantined immediately, fixed within one release, deleted if unfixable.
- Test code is reviewed with the same rigor as production code.

---

## The Nine Testing Layers

| # | Layer | Tooling | Runs |
|---|-------|---------|------|
| 1 | Unit | Vitest + Testing Library | Every commit |
| 2 | Integration | Vitest + Testing Library + user-event | Every commit |
| 3 | Accessibility | axe-core + jest-axe + manual AT audit | Every commit + per release |
| 4 | Visual Regression | Chromatic (Storybook) | Every PR |
| 5 | Performance | Vitest micro-benchmarks + Lighthouse CI + web-vitals | Every PR (bench) + nightly (LHCI) |
| 6 | Cross-Browser | Playwright on Chromium / Firefox / WebKit | Every PR |
| 7 | End-to-End | Playwright against the docs site | Every PR |
| 8 | Type Safety | `tsgo` (strict) + `tsd` for public API types | Every commit |
| 9 | SSR / Hydration | Vitest + `@testing-library/react` SSR + docs-site smoke | Every PR |

Layers 1–3 and 8–9 block merge. Layers 4–7 block release.

---

## 1. Unit Tests

**Objective:** Prove that every prop, variant, size, and state renders and behaves correctly in isolation.

**Scope, per component:**

- Every `variant` renders with the correct data-attribute and token application.
- Every `size` renders at the expected dimensions.
- Every state (`disabled`, `loading`, `invalid`, `readonly`, `selected`, `open`) toggles as expected.
- Controlled and uncontrolled patterns behave identically for the same input sequence.
- `className` merges (never overwrites).
- `ref` forwards to the correct underlying element.
- `asChild` renders the child element while preserving behavior.
- Every event handler fires with the correct semantic value (not the raw DOM event, unless documented).

**Non-goals:**

- Rendering behavior of underlying Radix primitives — trust the vendor's tests.
- Visual pixel-perfect assertions — that's Layer 4.

**Rule:** If a documented prop has no unit test, the prop doesn't exist.

---

## 2. Integration Tests

**Objective:** Prove that components behave correctly when **composed** — with each other, with forms, with routers, with theme.

**Scope:**

- Compound components (`Card.Header` inside `Card`, `Dialog.Trigger` opening `Dialog.Content`) wire up correctly.
- Form composition: `FormField` correctly associates `Label`, control, and error via `useId`.
- Theme switching updates every rendered component without remount.
- Portal-based components (`Dialog`, `Popover`, `Tooltip`) render into the correct target and clean up on unmount.
- Focus flows across composed components match the documented behavior.
- Keyboard interactions traverse composed structures correctly (`Tab` order, `Escape` closing nested overlays).

**Tooling:**

```tsx
// Example: integration test for a Dialog inside a Form
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

test('Dialog inside Form submits and restores focus', async () => {
  const user = userEvent.setup();
  render(<SettingsFormWithConfirmDialog />);
  await user.click(screen.getByRole('button', { name: /save/i }));
  await user.click(screen.getByRole('button', { name: /confirm/i }));
  expect(screen.getByRole('button', { name: /save/i })).toHaveFocus();
});
```

**Rule:** Every documented composition example in the docs has a matching integration test.

---

## 3. Accessibility Tests

**Objective:** Prove every component meets **WCAG 2.2 AA** and Novix UI's Design Principles for accessibility.

**Automated:**

- `jest-axe` runs against every variant × size × state × theme combination — **zero violations tolerated**.
- Keyboard walkthrough tests via `user-event` for every documented keyboard shortcut in the spec's Section 6.
- Focus management assertions: focus trap on modal open, focus restore on close, focus-visible ring present.
- ARIA attribute correctness: `aria-expanded`, `aria-controls`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, `aria-busy` fire when expected.
- Color contrast verified per theme via automated token analysis (light and dark meet 4.5:1 for text, 3:1 for UI).

**Manual (per release, checklist required):**

- Screen reader smoke test on **VoiceOver** (macOS + iOS) and **NVDA** (Windows).
- Keyboard-only navigation through every component's docs page.
- Forced-colors mode (Windows High Contrast) — component remains usable and legible.
- Reduced-motion mode — non-essential motion is collapsed to instant.
- Browser zoom at 200% — no clipping, no unreachable controls.

**Rule:** Accessibility failures block merge. There is no "we'll fix it later."

---

## 4. Visual Regression Tests

**Objective:** Catch unintended visual changes before they reach consumers.

**Scope:**

- Every component × variant × size × state × theme (light / dark) has a Storybook story.
- Chromatic snapshots every story on every PR.
- Diffs require explicit reviewer approval — no auto-accept.
- RTL variant snapshotted for every component that mirrors.
- Responsive snapshots at 375px, 768px, 1280px.

**Story structure:**

```tsx
// Button.stories.tsx
export default { title: 'Primitives/Button', component: Button };

export const AllVariants = () => (
  <div className="grid grid-cols-6 gap-4">
    {VARIANTS.map(v => SIZES.map(s => (
      <Button key={`${v}-${s}`} variant={v} size={s}>Label</Button>
    )))}
  </div>
);

export const AllStates = () => null; // default, hover, focus, active, disabled, loading
export const WithIcons = () => null; // leadingIcon, trailingIcon, icon-only
export const DarkTheme = () => null; // wrapped in ThemeProvider theme="dark"
export const RTL = () => null; // wrapped in dir="rtl"

```

**Rule:** Adding a variant means adding its story. No exceptions.

---

## 5. Performance Tests

**Objective:** Enforce Novix UI's performance budgets automatically — regressions fail CI.

**Budgets (per component, tracked in CI):**

| Metric | Budget |
|--------|--------|
| Bundle size (gzipped) | Documented per component; regressions > 5% fail CI |
| INP (interaction to next paint) | < 200ms for any documented interaction |
| CLS (cumulative layout shift) | 0 on mount |
| Render count on parent update | Documented; regressions fail CI |
| Time to interactive (docs page) | < 1s on simulated Fast 3G |

**Tooling:**

- **Micro-benchmarks** via Vitest for hot paths (large lists, virtualization, streaming text).
- **Bundle analysis** via `size-limit` — every component has a size entry, tracked over time.
- **Lighthouse CI** runs nightly against the docs site — perf ≥ 95, a11y ≥ 100, best-practices ≥ 95, SEO ≥ 95.
- **web-vitals** collection on the docs site + template starters, aggregated per release.
- **React Profiler** assertions in integration tests for components with known render sensitivity.

**Rule:** A component that regresses a budget does not merge until it doesn't.

---

## 6. Cross-Browser Tests

**Objective:** Prove Novix UI works on every browser we support, not just Chrome on macOS.

**Support matrix:**

| Browser | Versions | Runs |
|---------|----------|------|
| Chromium (Chrome, Edge, Brave) | Latest 2 | Every PR |
| Firefox | Latest 2 + ESR | Every PR |
| WebKit (Safari desktop + iOS) | Latest 2 | Every PR |
| Mobile Chrome (Android) | Latest | Nightly |
| Mobile Safari (iOS) | Latest | Nightly |

**Scope:**

- Playwright suite covers every interactive component through the docs site.
- Focus management, portals, overlays, and animations verified per browser.
- Touch-specific interactions (drawer drag-to-dismiss, long-press context menu) verified on WebKit + mobile emulation.
- Known browser quirks documented in the component's spec (Section 5 or 8) with a linked test.

**Rule:** A component that doesn't work in Safari doesn't work.

---

## 7. End-to-End Tests

**Objective:** Prove **real workflows** work — from a user opening the docs site to completing a realistic multi-component task.

**Scope:**

- Realistic flows through docs-site examples: submit a form, open a dialog inside a form, navigate a data table with keyboard, run a command palette action.
- Template starters (`saas-starter`, `admin-dashboard`, `ai-chat`) have their own E2E suites — smoke-tested per release.
- Authentication flows (where templates include them) covered end-to-end.
- Theme switching, RTL toggle, and reduced-motion toggle covered as user journeys.

**Tooling:**

- Playwright against the docs site's production build.
- Fixtures for realistic data (users, messages, table rows) live in a shared package.
- Traces captured on failure; retained for 7 days.

**Rule:** If a docs example can be walked by a user, it can be walked by Playwright.

---

## 8. Type Safety Tests

**Objective:** Prove the public API is correctly typed — including inference, polymorphism, and refusal of invalid combinations.

**Scope:**

- `tsgo` strict pass on the entire library and docs site.
- `tsd` type-level assertions for every component's public props:
  - Valid prop combinations compile.
  - Invalid variants, sizes, or event signatures fail to compile.
  - Polymorphic `as` / `asChild` correctly infers element props.
  - Refs are typed to the correct underlying element.
- No `any`, no `unknown` escape hatches in public APIs (lint-enforced).

**Example:**

```tsx
import { expectAssignable, expectError } from 'tsd';
import { Button } from 'novix-ui';

expectAssignable<Parameters<typeof Button>[0]>({ variant: 'primary', size: 'md' });
expectError<Parameters<typeof Button>[0]>({ variant: 'bogus' });
```

**Rule:** Types are part of the API. Type regressions are API breakages.

---

## 9. SSR / Hydration Tests

**Objective:** Prove every component renders server-side without throwing and hydrates without mismatches.

**Scope:**

- Every component rendered via `renderToString` in a Node environment — no `window` at module scope, no unguarded browser APIs.
- Docs-site production build rendered with TanStack Start SSR — no hydration warnings in console.
- Components requiring browser storage (theme persistence, dismissed banners) verified against the Novix UI hydration pattern (`useHydrated()` or `useEffect`, never `typeof window` in state initializers).
- Portal-based components mount cleanly post-hydration with no flash.
- Snapshot: SSR output for every component matches expected structure.

**Rule:** A hydration warning in a docs build is a P0 bug.

---

## Coverage Targets

**Enforced in CI, per package:**

| Metric | Floor | Target |
|--------|-------|--------|
| Statement coverage | 90% | 95% |
| Branch coverage | 85% | 90% |
| Function coverage | 90% | 95% |
| Public API surface exercised | 100% | 100% |
| Documented variants covered by visual regression | 100% | 100% |
| Documented keyboard shortcuts covered by user-event tests | 100% | 100% |
| axe-core violations across all stories | 0 | 0 |

**Rules:**

- Coverage is a **floor**, not a ceiling. Chasing 100% for its own sake produces bad tests.
- Public API surface coverage is **absolute** — every exported prop, subcomponent, and hook must be exercised.
- Missing coverage on a documented behavior blocks merge.
- Excluded files (test fixtures, type-only files) must be explicitly listed in `vitest.config.ts` with justification.

---

## CI Requirements

**Every PR runs, in order:**

1. **Lint** — ESLint + Prettier. Fails on any warning.
2. **Typecheck** — `tsgo` strict on all packages. Fails on any error.
3. **Unit + Integration + a11y + SSR** — Vitest. Fails on any failure or coverage drop.
4. **Type-level tests** — `tsd`. Fails on any assertion mismatch.
5. **Bundle size** — `size-limit`. Fails on regressions > 5% without justification.
6. **Visual regression** — Chromatic. Requires reviewer approval on diffs.
7. **Cross-browser** — Playwright on Chromium, Firefox, WebKit. Fails on any failure.
8. **E2E** — Playwright against docs-site production build. Fails on any failure.
9. **Lighthouse CI** — docs site perf/a11y/best-practices/SEO scores. Fails below thresholds.

**Nightly runs:**

- Full mobile browser matrix (Android Chrome, iOS Safari).
- Lighthouse CI trend collection.
- Dependency vulnerability scan.
- Full template-starter E2E suites.

**Release runs:**

- All of the above.
- Manual accessibility audit checklist signed off by named reviewer.
- Third-party a11y audit (v1.0 and every major thereafter).
- Changelog completeness check.

**Rules:**

- **Green CI is a prerequisite for merge.** No overrides, no exceptions.
- **Flaky tests are quarantined immediately** and fixed within one release, or deleted.
- **CI must complete in under 15 minutes** for the PR path — investment in parallelism is worth it.
- **Every failure links to a runbook** — no debugging cold.

---

## Definition of Done, Testing Edition

A component ships to `stable` **only** when all of these are true:

- [ ] Unit tests cover every prop, variant, size, and state.
- [ ] Integration tests cover every documented composition example.
- [ ] Accessibility tests: axe-core passes on every variant × state × theme; manual AT smoke test completed.
- [ ] Visual regression stories exist for every variant × size × state × theme × RTL × responsive breakpoint.
- [ ] Performance budgets met and enforced in CI.
- [ ] Cross-browser suite passes on Chromium, Firefox, WebKit.
- [ ] E2E flows in the docs site pass.
- [ ] Type-level tests cover valid and invalid prop combinations.
- [ ] SSR renders without warnings; hydration is clean.
- [ ] Coverage floors met.
- [ ] Every documented keyboard shortcut has a matching test.
- [ ] Named reviewer signed off on the a11y checklist.

Anything less is `experimental` — usable, but not promised.

---

*This document is versioned with the library. Amendments require review at the level of a spec change and must be reflected in every component's test suite within one minor release.*
