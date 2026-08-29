# Novix UI — API Philosophy

> One API, learned once, applied everywhere.
> Every component in Novix UI exposes the same props, named the same way, behaving the same way — unless there is a documented, reviewed reason not to.

This document is the source of truth for **how components look from the outside**. It is the operational companion to the [Design Principles](./DESIGN_PRINCIPLES.md) and the [Universal Component Specification](./COMPONENT_SPECIFICATION.md).

If a component invents its own prop where a canonical one would do, that component is **wrong**, not creative.

---

## The Core Promise

A developer who learns `<Button variant="primary" size="md" loading leftIcon={<Save />} />` can, without opening docs, guess:

- `<Badge variant="primary" size="md" />`
- `<Input size="md" leftIcon={<Search />} disabled />`
- `<Card variant="outline" radius="lg" />`
- `<Select size="sm" loading disabled />`

Same words. Same meaning. Same defaults. Every time.

**Rule:** If two components use the same prop name for different behavior, one of them is wrong.

---

## The Canonical Prop Surface

Every Novix UI component draws from this shared vocabulary. A component includes a prop **only if it applies**; it never renames or re-purposes one that does.

### Appearance

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `variant` | enumerated string | `"default"` | Semantic version of the component (`primary`, `secondary`, `ghost`, `outline`, `destructive`, `subtle`). Describes **meaning**, not color. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Standard size scale. Additional sizes require justification and a spec entry. |
| `color` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Semantic color intent when it varies **independently** of variant. Most components do not need this — variant is preferred. |
| `radius` | `"none" \| "sm" \| "md" \| "lg" \| "full"` | inherits from token | Corner radius override. Rarely needed — the design system decides. |
| `tone` | `"solid" \| "soft" \| "outline"` | component-specific | Visual weight, used only when a component genuinely offers all three (e.g. `Badge`, `Alert`). |

### State

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `disabled` | `boolean` | `false` | Non-interactive, non-focusable, communicated to AT via native semantics or `aria-disabled`. |
| `loading` | `boolean` | `false` | In-flight async state. Component remains focusable, shows a spinner in the correct slot, announces via `aria-busy`. |
| `readonly` | `boolean` | `false` | Inputs only. Focusable, not editable. |
| `invalid` | `boolean` | `false` | Form controls only. Sets `aria-invalid`, applies error tokens. |
| `required` | `boolean` | `false` | Form controls only. Sets `aria-required`, mirrors native semantics. |
| `defaultOpen` / `open` | `boolean` | `false` | Uncontrolled / controlled disclosure. Always paired with `onOpenChange`. |
| `defaultValue` / `value` | any | — | Uncontrolled / controlled value. Always paired with `onValueChange`. |

**Rule:** Controlled and uncontrolled patterns follow Radix conventions: `defaultX` uncontrolled, `x` + `onXChange` controlled. Never invent `initialX`, `setX`, `onChangeX`.

### Content Slots

| Prop | Type | Purpose |
|------|------|---------|
| `children` | ReactNode | Primary content. Always the first choice. |
| `icon` | ReactNode | Single icon when the component has one obvious slot (e.g. `IconButton`). |
| `leftIcon` | ReactNode | Icon rendered before content, LTR. Mirrors under RTL. |
| `rightIcon` | ReactNode | Icon rendered after content, LTR. Mirrors under RTL. |
| `startContent` | ReactNode | Arbitrary node before content when it isn't strictly an icon (e.g. avatar, chip). |
| `endContent` | ReactNode | Arbitrary node after content. |
| `slots` | `Partial<Record<SlotName, ReactNode>>` | Escape hatch for compound components with many nameable regions (e.g. `Toast`, `EmptyState`). Prefer subcomponents (`Card.Header`) when structure is fixed. |

**Rule:** Content goes in `children` unless the component has two or more positional regions that need to be distinguished. Never accept `title`, `label`, or `description` as string props when `children` would work — with rare exceptions for form controls where `label` is semantically bound to the input.

### Composition & Ref Forwarding

| Prop | Type | Purpose |
|------|------|---------|
| `asChild` | `boolean` | Radix Slot pattern. Renders the component's behavior and styles onto its child element. The universal escape hatch. |
| `as` | element type | Polymorphic element override for primitives that don't compose via `asChild` (rare — prefer `asChild`). |
| `ref` | forwarded ref | Every component forwards its ref to the underlying DOM element. Compound components forward per-part refs. |
| `className` | `string` | Merged with internal classes via `cn()`. Never overwrites — appends. |
| `style` | `CSSProperties` | Inline style override. Always merged, never replaced. |

**Rule:** `asChild` is the preferred way to change the rendered element. `as` exists only where `asChild` cannot (deeply generic primitives).

### Motion

| Prop | Type | Purpose |
|------|------|---------|
| `motionPreset` | `"snap" \| "soft" \| "glide" \| "none"` | Selects one of the shared spring presets. `"none"` disables motion for that instance. |
| `motionProps` | `MotionProps` | Escape hatch to pass Motion (`framer-motion`) props directly for advanced cases. Rarely used. |
| `disableAnimation` | `boolean` | Coarse switch equivalent to `motionPreset="none"`. Provided for parity with system-wide toggles. |

**Rule:** `prefers-reduced-motion: reduce` always wins, regardless of these props.

### Identity & Testing

| Prop | Type | Purpose |
|------|------|---------|
| `id` | `string` | Standard DOM id. Auto-generated via `useId()` when needed for ARIA wiring. |
| `data-*` | `string` | Test hooks, analytics attributes, and consumer instrumentation pass through untouched. |
| `aria-*` | standard | All ARIA attributes are forwarded to the semantically correct element. |

### Event Handlers

- All handlers follow `on<Event>` — `onClick`, `onChange`, `onOpenChange`, `onValueChange`, `onSelect`.
- Change handlers receive **the value**, not the event: `onValueChange: (value: T) => void`. Native DOM events remain available via the underlying element when consumers use `asChild`.
- No `handleX` prop names. No `onXChanged` past tense. No `xCallback`.

---

## Data Attributes Contract

Every component emits **stable `data-*` attributes** so consumers can style states without inspecting internal classnames.

Standard attributes, always present when applicable:

| Attribute | Values | Meaning |
|-----------|--------|---------|
| `data-slot` | slot name | Identifies compound-component parts (`data-slot="trigger"`, `data-slot="content"`). |
| `data-state` | `"open" \| "closed" \| "checked" \| "unchecked" \| "on" \| "off"` | Stateful widgets expose their current state. |
| `data-variant` | variant name | Mirrors the `variant` prop. |
| `data-size` | `"sm" \| "md" \| "lg"` | Mirrors the `size` prop. |
| `data-disabled` | present when true | Mirrors `disabled`. |
| `data-loading` | present when true | Mirrors `loading`. |
| `data-invalid` | present when true | Mirrors `invalid`. |
| `data-orientation` | `"horizontal" \| "vertical"` | For components with orientation. |
| `data-side` | `"top" \| "right" \| "bottom" \| "left"` | Positioned popovers, tooltips, dropdowns. |

**Rule:** Consumers can rely on `[data-state="open"]` forever. Internal classnames are not a public API.

---

## Naming Rules

- **Nouns for props, verbs for handlers.** `size`, `variant`, `loading`; `onClick`, `onOpenChange`.
- **Booleans are affirmative and unprefixed.** `disabled`, `loading`, `open` — not `isDisabled`, `hasLoading`, `shouldOpen`.
- **Enumerations are lowercase strings.** `"primary"`, not `"Primary"` or `PRIMARY` or an enum import.
- **No abbreviations.** `background`, not `bg`. `description`, not `desc`. `leftIcon`, not `lIcon`.
- **Consistent tense.** Always present tense for state (`open`), always past tense for events fired after the fact (`onOpened` is wrong — use `onOpenChange`).
- **Never leak library internals.** No `variantsConfig`, no `stitchesProps`, no `radixInternals`.

**Rule:** A prop name should read like plain English to a developer who has never used the library.

---

## Compound Component Pattern

For components with fixed internal structure, prefer subcomponents over slot props:

```tsx
<Card variant="elevated">
  <Card.Header>
    <Card.Title>Novix UI</Card.Title>
    <Card.Description>Composable primitives.</Card.Description>
  </Card.Header>
  <Card.Body>…</Card.Body>
  <Card.Footer>…</Card.Footer>
</Card>
```

- Subcomponents are attached as static properties (`Card.Header`), not exported separately unless the compound is huge.
- Each subcomponent accepts the full canonical prop surface (`className`, `asChild`, `ref`, `data-*`) that applies.
- Slot props (`slots={{ header: … }}`) are used only when structure varies significantly between use cases.

**Rule:** If the structure is fixed, use subcomponents. If it varies, use slots. Never both for the same component.

---

## Extension Escape Hatches

When the canonical API doesn't cover a case, use — in this order:

1. **`asChild`** — render as a different element while keeping behavior and styles.
2. **`className` + design tokens** — override appearance using semantic tokens, never raw values.
3. **`slots`** — replace a nameable region.
4. **`motionProps`** — customize animation for one instance.
5. **Compose from primitives** — if none of the above fit, the component isn't right for your use case. Compose from lower-level primitives instead of forcing a prop.

**Rule:** If you find yourself proposing a new prop, first check whether one of these five paths already solves it.

---

## When a Component *May* Invent a Prop

A component may add a component-specific prop **only if**:

1. The behavior is genuinely unique to that component (e.g. `Slider` needs `min`, `max`, `step`).
2. No canonical prop expresses the same idea.
3. The prop name follows all naming rules above.
4. The prop is documented in the component's spec under Section 12 (Future Extensions) with justification.
5. The prop is reviewed by both a design and an engineering reviewer.

**Rule:** Component-specific props are exceptions. Exceptions require justification. Justifications live in the spec.

---

## Forbidden Patterns

These are rejected on sight in review:

- ❌ Renaming a canonical prop (`kind` instead of `variant`, `type` instead of `variant`, `scale` instead of `size`).
- ❌ String content props when `children` works (`title=""`, `label=""` on non-form components).
- ❌ Boolean flags that duplicate a variant (`primary`, `secondary` as separate booleans instead of `variant`).
- ❌ Passing raw colors or hex codes as props (`color="#3B82F6"` — use tokens).
- ❌ Handlers receiving synthetic events when the semantic value is what matters (`onChange: (e) => e.target.value`).
- ❌ Prop names that leak the underlying library (`radixProps`, `motionConfig`).
- ❌ Inventing a new state prop (`busy`, `pending`, `waiting`) when `loading` exists.
- ❌ Un-forwarded refs. Un-merged `className`. Un-mirrored RTL icons.

---

## Type Contract

Every component's public props type extends a shared base:

```ts
// Simplified — canonical types live in src/nova/utils/types.ts
export interface NovaBaseProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  asChild?: boolean;
}

export interface NovaAppearanceProps {
  variant?: string;
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export interface NovaStateProps {
  disabled?: boolean;
  loading?: boolean;
}

export interface NovaMotionProps {
  motionPreset?: 'snap' | 'soft' | 'glide' | 'none';
  motionProps?: import('motion/react').MotionProps;
  disableAnimation?: boolean;
}
```

Components compose the interfaces that apply. Types are the enforcement mechanism: if a component's props don't extend the correct base, CI fails.

**Rule:** The type system encodes this philosophy. Deviations don't just fail review — they fail the build.

---

## Definition of Done, API Edition

A component's API is considered aligned only when all of these are true:

- [ ] Every applicable prop from the canonical surface is present, unrenamed, unrepurposed.
- [ ] No prop invents behavior that a canonical prop already covers.
- [ ] All stateful behavior emits the standard `data-*` attributes.
- [ ] Ref is forwarded to the correct underlying element.
- [ ] `className` and `style` are merged, never overwritten.
- [ ] `asChild` is supported wherever composition makes sense.
- [ ] Motion respects `prefers-reduced-motion` and the shared presets.
- [ ] Any component-specific prop is justified in the spec.
- [ ] Types extend the shared base interfaces.
- [ ] Sibling components (`Button` ↔ `IconButton`, `Input` ↔ `Textarea`) have identical prop names for shared concepts.

If any box is unchecked, the component's API is **not** ready — regardless of how well it renders.

---

*This document is versioned with the library. Amendments require review at the level of a breaking API change and must be applied to every existing component within one minor release.*
