# Foundation Components — v0.1

The Novix UI v0.1 foundation. Every component here has passed the six quality
gates in `ENGINEERING_SPEC.md` Part VII, follows the language in
`DESIGN_LANGUAGE.md`, and honors the shared API vocabulary in
`API_PHILOSOPHY.md`.

| Component | Import | Role |
|---|---|---|
| [Button](#button) | `Button` | Primary action archetype |
| [IconButton](#iconbutton) | `IconButton` | Square icon-only action, a11y-enforced |
| [Label](#label) | `Label` | Form control label, with required/optional |
| [Badge](#badge) | `Badge` | Status and metadata chip |
| [Card](#card) | `Card` + parts | Surface container |
| [Separator](#separator) | `Separator` | Visual and semantic divider |
| [Avatar](#avatar) | `Avatar` + `AvatarGroup` | Person or entity portrait |
| [Skeleton](#skeleton) | `Skeleton` | Loading placeholder |
| [Spinner](#spinner) | `Spinner` | Activity indicator |
| [Kbd](#kbd) | `Kbd` + `KbdSequence` | Keyboard key cap |

All imports:
```ts
import {
  Button, IconButton, Label, Badge, Card, CardTitle,
  Separator, Avatar, AvatarGroup, Skeleton, Spinner, Kbd, KbdSequence,
} from "@/nova";
```

---

## Button

**Purpose.** The primary trigger for an action. Every other control in Nova
inherits Button's motion, focus, and state semantics.

**Variants.** `primary` · `accent` · `secondary` · `ghost` · `outline` ·
`destructive` · `link`
**Sizes.** `sm` · `md` (default) · `lg` · `icon`
**Props.** `variant` · `size` · `loading` · `disabled` · `leadingIcon` ·
`trailingIcon` · `asChild` · `className` · `ref` · all native `button` props

**Usage.**
```tsx
<Button>Save</Button>
<Button variant="secondary" leadingIcon={<Sparkles />}>Generate</Button>
<Button loading>Saving</Button>
<Button asChild><a href="/pricing">Pricing</a></Button>
```

**Accessibility.**
- Renders a native `<button>` unless `asChild` is used.
- `loading` sets `aria-busy="true"` and disables interaction.
- The Nova Ring is applied on `:focus-visible` in both modes.

**Keyboard.** `Enter` · `Space` → activate. `Tab` moves focus.

**Best practices.**
- One primary Button per section — hierarchy is a scarcity signal.
- Use `leadingIcon` for iconography, not `children` with an inline SVG.
- Prefer `variant="destructive"` for irreversible actions; pair with a
  confirmation flow.

**Common mistakes.**
- ❌ `<Button variant="primary" variant="secondary" />` — variants are
  mutually exclusive.
- ❌ Wrapping an `<a>` yourself. Use `asChild` so props and refs merge.
- ❌ Icon-only Button without `aria-label`. Use `IconButton` instead — it
  enforces the label at the type level.

---

## IconButton

**Purpose.** A square action reserved for icon-only affordances. Type-forces
`aria-label` or `aria-labelledby`; the compiler rejects an unnamed icon
button.

**Variants.** `primary` · `accent` · `secondary` · `ghost` (default) ·
`outline` · `destructive`
**Sizes.** `xs` · `sm` · `md` · `lg` · `xl`

**Usage.**
```tsx
<IconButton aria-label="Close" icon={<X />} />
<IconButton aria-label="Refresh" loading icon={<RefreshCw />} />
<IconButton aria-label="Star" variant="ghost"><Star /></IconButton>
```

**Accessibility.**
- Required `aria-label` (or `aria-labelledby`) enforced by TypeScript.
- Icons are always `aria-hidden`; the label is the accessible name.
- Focus and pressed states are visually distinct from Button.

**Keyboard.** Same as Button.

**Best practices.**
- Group related IconButtons with a `role="toolbar"` container.
- Pair with `<Tooltip>` (v0.2+) once tooltips ship.

**Common mistakes.**
- ❌ `<button><X /></button>` — a bare icon in a native button has no
  accessible name. Use IconButton.
- ❌ Rectangular IconButton. If it needs a label, it's a Button.

---

## Label

**Purpose.** The semantic label for a form control. Built on Radix Label so
clicks forward to the associated input.

**Sizes.** `sm` · `md` (default) · `lg`
**Tones.** `default` · `muted` · `invalid`
**Props.** `htmlFor` · `required` · `optional` · `disabled`

**Usage.**
```tsx
<Label htmlFor="email" required>Email</Label>
<input id="email" />

<Label htmlFor="bio" optional>Bio</Label>
<textarea id="bio" />
```

**Accessibility.**
- `required` renders a visual `*` **and** a `<span class="sr-only">(required)</span>`
  announcement — never color or symbol alone.
- Setting `disabled` styles the label; the paired control must be
  disabled independently.

**Best practices.**
- Every input in Nova is preceded by a Label. Placeholders are never labels.
- `tone="invalid"` mirrors the input's error state — don't paint red by hand.

---

## Badge

**Purpose.** A compact chip for status, counts, and metadata.

**Variants.** `neutral` (default) · `accent` · `primary` · `success` ·
`warning` · `danger` · `outline`
**Sizes.** `sm` · `md` · `lg`
**Props.** `dot`

**Usage.**
```tsx
<Badge variant="success" dot>Live</Badge>
<Badge variant="outline">v0.1.0</Badge>
```

**Accessibility.**
- Badge is decorative by default; wrap in a semantic container (`<span
  role="status">…</span>`) when it announces state changes.

**Best practices.**
- Use `dot` to reinforce status; never rely on color alone.
- Reserve `variant="primary"` for high-emphasis counts (unread messages).

---

## Card

**Purpose.** The default surface container. Composes with `CardHeader`,
`CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

**Variants.** `default` · `elevated` · `outline` · `ghost`
**Padding.** `none` · `sm` · `md` (default) · `lg`
**Props.** `interactive`

**Usage.**
```tsx
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Monthly plan</CardTitle>
    <CardDescription>Cancel anytime, keep your data.</CardDescription>
  </CardHeader>
  <CardContent>$24 / month</CardContent>
  <CardFooter><Button>Choose plan</Button></CardFooter>
</Card>
```

**Best practices.**
- `interactive` only on cards that are the entire click target; make the
  primary action a real Button/link inside via `asChild`.
- Avoid nesting elevated cards more than one level.

---

## Separator

**Purpose.** A rule between groups. Optional inline label.

**Props.** `orientation` (`horizontal` | `vertical`) · `decorative` · `label`

**Usage.**
```tsx
<Separator />
<Separator label="or" />
<Separator orientation="vertical" />
```

**Accessibility.**
- Decorative by default (`role="none"`). Pass `decorative={false}` for
  semantic separation.

---

## Avatar

**Purpose.** Portrait for a person or entity. Handles image loading, error
fallback, initials computation, and presence.

**Sizes.** `xs` · `sm` · `md` (default) · `lg` · `xl` · `2xl`
**Shape.** `circle` (default) · `squircle`
**Ring.** `none` · `subtle` (default) · `strong` · `accent`
**Props.** `src` · `alt` · `name` · `status` (`online` | `offline` | `busy` |
`away`) · custom `children` for fallback

**Usage.**
```tsx
<Avatar src="/ada.jpg" name="Ada Lovelace" status="online" />
<Avatar name="Grace Hopper" ring="accent" />

<AvatarGroup max={3}>
  <Avatar name="A" /><Avatar name="B" /><Avatar name="C" /><Avatar name="D" />
</AvatarGroup>
```

**Accessibility.**
- Provide `alt` when using `src`. If omitted, `name` is used as `alt`.
- `status` renders a `role="status"` dot with a localized label.
- Initials are computed deterministically and never expose raw emails.

**Best practices.**
- Prefer `name` over embedding initials as children — one source of truth.
- Use `AvatarGroup` for lists of collaborators; cap `max` at 3–5.

---

## Skeleton

**Purpose.** Reserve layout while content loads. Two modes: `shimmer`
(default) and `pulse` (auto-selected under reduced motion).

**Shapes.** `rect` (default) · `pill` · `circle` · `text`
**Props.** `lines` (for `shape="text"`)

**Usage.**
```tsx
<Skeleton className="h-8 w-40" />
<Skeleton shape="circle" className="size-10" />
<Skeleton shape="text" lines={3} />
```

**Accessibility.**
- Announced with `role="status"` + `aria-busy="true"` and `aria-live="off"`
  — Skeleton reserves space, it doesn't describe absent content.

**Performance.**
- Uses `transform: translateX` for the shimmer; compositor-only.
- Under `prefers-reduced-motion`, shimmer is replaced by a slow pulse.

---

## Spinner

**Purpose.** An activity indicator when a duration is unknown.

**Sizes.** `xs` · `sm` · `md` (default) · `lg` · `xl` · `inherit` (matches
`1em` of the parent)
**Tones.** `current` (default) · `muted` · `accent` · `primary`
**Props.** `label` · `strokeWidth`

**Usage.**
```tsx
<Spinner />
<Spinner size="lg" tone="accent" label="Loading dashboard" />
```

**Accessibility.**
- Decorative by default (`aria-hidden`).
- Providing a `label` promotes the SVG to `role="status"` with
  `aria-live="polite"`.
- Under `prefers-reduced-motion`, rotation slows to a non-distracting 2s.

**Best practices.**
- Prefer Skeleton for layout that will fill in; use Spinner for
  transient overlays and pending buttons.
- Nova's Button and IconButton render a Spinner automatically when
  `loading` is true — don't nest one manually.

---

## Kbd

**Purpose.** A keyboard key cap. Semantic `<kbd>` markup, physical visual.

**Sizes.** `xs` · `sm` · `md` (default) · `lg`
**Tones.** `default` · `subtle` · `inverted`
**Props.** `pressed`

**Sequence.**
```tsx
<Kbd>Enter</Kbd>
<KbdSequence keys={["⌘", "K"]} />
<KbdSequence keys={["Ctrl", "Shift", "P"]} separator="+" />
```

**Accessibility.**
- Rendered as `<kbd>` so assistive tech announces the key(s).
- Separators (`+`) are decorative — SR hears "Command K", not
  "Command plus K".

**Best practices.**
- In shortcut docs, always pair the Kbd with a describing sentence
  ("Open the command palette with **⌘K**"), not the Kbd alone.
- For cross-platform shortcuts, compute `keys` from `navigator.platform`
  at render time; do not hardcode Mac symbols on Windows.

---

## Definition of Done — v0.1

All ten components:
- Use semantic tokens only; no hex, no rgb, no hardcoded colors.
- Support light and dark themes; verified in both.
- Are SSR-safe; render server-side without `window`/`document` access.
- Are strict-typed; no `any` in the public surface.
- Forward refs to the documented root element.
- Support `className` merged via `cn` and `data-slot="…"` on every slot.
- Ship a unit + a11y + interaction test in `src/nova/ui/__tests__/`.
- Are showcased on the docs landing page.

The foundation is stabilized. Additional components ship per `ROADMAP.md`.
