# Novix UI — Design Language Specification

> The official design bible. Every decision in Novix UI — a token, a shadow, a
> curve, a millisecond of easing — traces back to this document. If a rule
> here is broken, the rule changes first, in writing, before the pixel does.

Status: Canonical · Version: 1.0 (Language) · Owner: Design Systems Council

This is not a component list. This is the *language* the components speak.
Read it before writing a token, opening a Figma file, or reviewing a PR.

---

## Part I — Philosophy

### 1. Visual Philosophy — "Quiet Confidence"

Novix UI is **quiet on the outside, precise on the inside.** It doesn't shout
with gradients, mascots, or maximalist flourish. It earns attention through
craft: the exact radius, the honest shadow, the type that sits perfectly on
the baseline. The interface should feel like a well-made object — a Braun
radio, a Leica viewfinder, a Muji notebook — where nothing is decorative and
nothing is missing.

Three tenets:
1. **Restraint over ornament.** If it isn't load-bearing, it isn't drawn.
2. **Depth without weight.** Surfaces feel real, never heavy.
3. **Motion as meaning.** Movement explains state; it never entertains.

The screenshot test: mute the logo, hide the brand color, and Nova should
still be identifiable by its rhythm — the way space breathes, the way corners
meet, the way a focus ring lives.

### 2. Brand Personality

| Attribute | Yes | No |
|---|---|---|
| Voice | Precise, human, dry wit | Bubbly, corporate, hype |
| Posture | Calm expert | Eager assistant |
| Density | Considered | Sparse or cluttered |
| Color | Structural | Decorative |
| Motion | Deliberate | Playful |
| Errors | Honest and actionable | Cute or apologetic |

Nova speaks like a senior engineer who respects your time.

### 3. Interaction Principles

1. **Predictable before delightful.** Delight is the reward for consistency,
   never a substitute.
2. **Direct manipulation over indirection.** If the user can touch the thing,
   let them touch the thing.
3. **State is visible.** Loading, focus, selection, error, disabled, dirty,
   pending — each has a dedicated visual signal, never guessed from context.
4. **Progressive disclosure.** Show what's needed now; keep power one keystroke
   away.
5. **Reversible by default.** Destructive actions are announced, delayed, or
   undoable. The system trusts the user; the user trusts the system back.

### 4. Motion Philosophy — "Physics, not Choreography"

Motion in Nova has one job: make cause and effect legible. Every animation
answers *where did this come from* and *where is it going*.

- **Origin-aware.** Menus grow from the trigger; dialogs rise from the layer
  that summoned them; toasts enter from the region they'll live in.
- **Spring-first, ease-second.** Interactive motion uses spring physics
  (mass, tension, friction). State transitions use eased curves. Never both
  on the same element.
- **Under 240ms for interactive, under 400ms for structural.** Longer feels
  slow; shorter feels twitchy.
- **One thing moves.** If two elements move at once, they move as one system,
  sharing a transform origin.
- **Reduced motion is a first render, not a fallback.** Every animation has a
  documented reduced-motion counterpart designed at the same time.

Nova motion never bounces for personality, never rotates for spectacle, never
pulses to fill silence.

### 5. Shape Language — "Soft geometry"

Nova's shapes are **rectangles with intent**. The primary geometry is the
rounded rectangle, drawn with a **superellipse (squircle)** corner rather than
a circular arc, so radii read as *smooth* instead of *bevelled*. A 12px Nova
radius is not the same curve as a 12px CSS radius; the corner spends its
curvature more evenly along the edge.

- **Two families:** *Control* (4/6/8/10 — inputs, buttons, chips) and
  *Surface* (12/16/20/28 — cards, sheets, dialogs). Never mix families on
  nested elements more than one step apart.
- **Concentric radii.** A child inside a parent uses `parent_radius − padding`.
  Never a smaller-than-parent radius that doesn't share the same center of
  curvature.
- **Pill only for status.** Full-round is reserved for badges, chips, and
  avatars — never for primary actions.

### 6. Color Philosophy — "Structural color"

Color in Nova carries *meaning*, not decoration.

- **Neutrals do the work.** 90% of the interface is neutrals. Brand color
  appears where the user must act or attend.
- **OKLCH, not HSL.** All scales are authored in OKLCH so lightness reads
  perceptually equal across hues. A 500-step blue and a 500-step red have the
  same visual weight.
- **Foregrounds are picked, not guessed.** Every semantic surface has a paired
  foreground token that guarantees WCAG AA at minimum, AAA where feasible.
- **No hue owns "premium."** Nova ships with a monochrome-forward default;
  brand palettes are opt-in and validated by the Theme Generator.
- **Dark mode is a re-authoring, not an inversion.** Lightness curves flip;
  chroma is re-tuned; shadows shift from darkening to lightening; borders
  become brighter than surface, not darker.

### 7. Typography Philosophy — "Type as grid"

Typography sets Nova's rhythm before anything else does.

- **One display, one text, one mono.** Never four. Default pairing: *Geist
  Sans* (text), *Geist Sans* tuned tighter for display, *Geist Mono* for
  numerals and code.
- **Optical sizes.** Display type uses tighter tracking and a lower x-height
  ratio than body. We don't just scale the same face.
- **Tabular numerals everywhere numbers matter.** Tables, KPIs, timestamps,
  prices. Non-tabular numerals only in prose.
- **Modular scale of 1.200.** Small, human, easy to remember: 12 · 14 · 16 ·
  18 · 20 · 24 · 30 · 36 · 48 · 60 · 72.
- **Line-height couples to size.** Body ≈ 1.5, UI ≈ 1.4, display ≈ 1.1.
- **Never justify. Never all-caps for reading.** Small-caps allowed for
  eyebrows and section labels.

### 8. Spacing Philosophy — "The 4pt beat"

- **Base unit: 4px.** Every dimension in Nova is a multiple of 4, with an
  occasional 2 for optical alignment.
- **Scale is geometric, not linear**, after the first few steps: 0 · 2 · 4 ·
  6 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96.
- **Space belongs to the container, not the child.** Layouts compose with
  `gap`, not margin. Margins survive only for prose flow.
- **Density is a knob, not a redesign.** Comfortable / Cozy / Compact scale
  padding and control heights while preserving type and radius.

### 9. Elevation Philosophy — "Believable light"

Nova's elevation system is physical: a light source above and slightly
forward, a soft ambient fill, and honest occlusion. Six levels, each with a
purpose.

| Level | Use | Character |
|---|---|---|
| 0 | Flush with page | No shadow; border only if separation is needed |
| 1 | Resting card | 1px key line + 1 soft ambient shadow |
| 2 | Hover / small pop | Ambient grows; key line slightly brightens |
| 3 | Menus, popovers | Directional shadow; subtle contact shadow |
| 4 | Dialogs, sheets | Deeper ambient; scrim behind |
| 5 | Toasts, HUD | Highest; strong directional; brief |

Shadows are **tinted with the surface underneath**, not pure black. On a warm
surface, the shadow warms. On dark mode, shadows *lighten* the edge of the
surface above rather than darkening the surface below (a subtle inner top
highlight — Nova's signature "moon-edge").

### 10. Glass Philosophy — "Optical honesty"

Glass is used sparingly, and only when the surface truly floats above content
that matters. Nova glass is:

- **Backdrop blur 20–40px**, saturation +10%, brightness matched to ambient
  mode (down in light, up in dark).
- **Always bordered.** A 1px hairline of `color-mix(fg 12%, transparent)` to
  keep the edge readable on any background.
- **Never on top of static content that never moves.** Glass is for surfaces
  that overlay something worth seeing through — command palettes, HUDs,
  media controls.

### 11. Depth Philosophy — "Three layers, no more"

Every screen has at most three depth planes: **Canvas** (page), **Surface**
(cards, panels), **Overlay** (menus, dialogs, toasts). Nesting beyond three
is a design smell — flatten instead.

### 12. Lighting Philosophy

A single global light source at **12 o'clock, slightly forward**. All shadows
descend consistently. Highlights (the moon-edge) are always at the top edge.
This gives Nova screenshots a subliminal coherence: turn any component upside
down and it looks wrong.

### 13. Contrast Philosophy

- **Contrast is a hierarchy tool first, a legibility tool always.** The most
  important thing on a screen has the most contrast; the least important has
  the least.
- **Four text roles:** primary, secondary, tertiary, disabled — with fixed
  contrast ratios (≥7:1, ≥4.5:1, ≥3:1, ≥1.6:1 non-interactive only).
- **Non-text contrast is a first-class citizen.** Borders on inputs, focus
  rings, chart lines, and icon-only controls all meet ≥3:1.

### 14. Micro-Interaction Philosophy

Every interactive element in Nova has a **four-state signature**: rest,
hover, press, focus. Every state is designed, not derived. Hover raises light,
press lowers it, focus adds the Nova ring (see §17.4). No wobble, no scale
above 1.02, no color-only state changes.

### 15. Accessibility Philosophy — "The default is the accessible one"

Accessibility is not a mode. It is the shipped design.

- **Keyboard-first.** Every affordance is reachable and operable without a
  pointer. Focus is always visible, always restored.
- **Screen-reader parity.** Every visual state has a semantic equivalent.
- **Reduced motion, reduced transparency, forced colors** are supported, not
  polyfilled.
- **Contrast is enforced by the token system.** A theme that fails contrast
  cannot ship — the Theme Generator refuses to export it.
- **Touch targets ≥44px** on any surface that might see a finger.

### 16. Performance Philosophy — "60fps is a design constraint"

Design decisions that can't hold 60fps on a mid-range laptop don't ship.
Blurs are budgeted, shadows are rasterized, animations use compositor-only
properties (`transform`, `opacity`, `filter`), and lists virtualize past 100
items by default. Cold render of a Nova page is under 100KB of CSS.

### 17. Developer Experience Philosophy

The design language is only real if developers can wield it without thinking.

- **Semantic tokens only** in components — never raw colors.
- **One prop vocabulary** across the library (see `API_PHILOSOPHY.md`).
- **Composition beats configuration.** Small pieces, honest APIs.
- **Every component ships with tests, docs, and a story** — see the
  Component Specification.

---

## Part II — The Signatures

These are the ideas Novix UI owns. If any is copied, it should read as
homage. If all are present, it is Nova.

### 17.1 The Moon-Edge
A 1px inner top highlight on every raised surface — `inset 0 1px 0
color-mix(fg 8%, transparent)`. In dark mode it becomes the primary way the
eye reads elevation, replacing shadow.

### 17.2 The Squircle Corner
All Nova radii are drawn with a superellipse (n≈5). The Figma library, the
Tailwind tokens, and the SVG icons all use the same corner. Corners never
"pinch."

### 17.3 The Nova Shadow
Two-part shadow: a **contact** (1px, offset 0, high alpha, tight blur) and an
**ambient** (larger offset, low alpha, wide blur), both tinted by the surface
underneath via `color-mix`. Never a single-cast drop shadow.

### 17.4 The Nova Ring
Focus ring = **2px outer ring** of `--color-ring` at 90% opacity + **1px
inner separator** of the surface color. Two-tone, always visible on any
background, never clipped by the container. Animated in with a 120ms
scale-from-1.06 → 1.

### 17.5 The Halo Hover
On elevated interactive surfaces, hover raises a **radial halo** behind the
element (60% opacity, 40px blur, tinted with `--color-primary`). The element
itself does not move. Cursor position offsets the halo center by up to 6px —
"the light follows the pointer."

### 17.6 The Press Sink
Press states use **z-translate, not scale.** A 1px downward translate + a
shadow attenuation. Feels physical without ever changing the element's
footprint.

### 17.7 The Nova Loading Bar
A single 2px bar, top of viewport, with a shimmer that travels at a
constant physical speed regardless of duration — the bar reports *activity*,
not *progress*.

### 17.8 The Aperture Transition
Page and dialog entrances use an **aperture**: a small clip-path rectangle
grows from the trigger's bounding box to the destination bounds, over
280–360ms, spring-damped. Nothing fades in on Nova; things *open*.

### 17.9 The Ink Cursor
On interactive text (command palettes, inline editors, chat prompts) the
caret is a **2px vertical bar with a 1px trailing shadow** that lags one
frame. Reads as "ink drying." Subtle, unmistakable.

### 17.10 The Gradient Discipline
Nova has exactly one gradient family: **linear, 180°, ≤8% delta**, used only
on brand surfaces (hero KPIs, primary CTAs on marketing). No radial gradients.
No rainbow, no purple-to-pink. If a gradient is doing work, it's the Nova
gradient.

### 17.11 The Glass Hairline
Glass surfaces carry a **top hairline** that is *brighter* than the surface
below and a **bottom hairline** that is *darker* — a two-tone edge that reads
as physical glass thickness.

### 17.12 The Numeric Tick
Every changing number (KPIs, counts, streaming tokens) animates with a
**vertical wheel**: outgoing digit slides up, incoming slides in from below,
tabular-locked so the layout never reflows. Signature of Nova dashboards.

### 17.13 The Icon Optical Grid
Nova icons live on a 24×24 grid with a **20×20 optical safe area** and
**1.75px** default stroke — heavier than Lucide, lighter than Material.
Corners share the squircle curvature. Icons read as siblings of the type.

### 17.14 The Silent Empty
Empty states use a single line of text and a single tertiary action. No
illustration by default. Silence is the design.

### 17.15 The AI Stream Halo
Streaming AI responses carry a **soft breathing halo** around the message
surface at 0.6Hz. When the stream ends, the halo contracts into a 4px
completion tick at the message's bottom-right corner.

### 17.16 The Command Veil
Opening the command palette dims the app with a **1px-grained noise scrim**
(not a flat black) — the app is still there, just held back.

### 17.17 The Theme Cross-fade
Theme switching cross-fades tokens over 220ms with a **1-frame stagger by
depth** (canvas first, surface next, overlay last). Reads as light changing
in a room, not a color swap.

---

## Part III — Systems

### 18. Color Language

Three layers of tokens; components only ever touch layer 3.

1. **Primitive** — raw OKLCH scales (`neutral.50`…`neutral.950`, `brand.…`,
   `success.…`, `warn.…`, `danger.…`, `info.…`). Not consumed by components.
2. **Alias** — role-based (`--color-fg`, `--color-fg-muted`, `--color-bg`,
   `--color-surface`, `--color-surface-raised`, `--color-border`,
   `--color-border-strong`, `--color-ring`, `--color-primary`,
   `--color-primary-foreground`, semantic status colors and their
   foregrounds).
3. **Component** — computed from alias (`--button-primary-bg`,
   `--input-border-focus`), rarely exposed, always derivable.

Rules: never a hex in a component; never chroma above the gamut envelope;
never a foreground without a validated pairing.

### 19. Typography System

- **Families:** `--font-sans`, `--font-display`, `--font-mono`.
- **Scale:** `text-xs` 12 / `sm` 14 / `base` 16 / `md` 17 / `lg` 18 /
  `xl` 20 / `2xl` 24 / `3xl` 30 / `4xl` 36 / `5xl` 48 / `6xl` 60 / `7xl` 72.
- **Weights:** 400, 500, 600, 700. No 300, no 800.
- **Tracking:** display negative (`-0.02em` at 48+), body neutral, mono
  slightly positive.
- **Roles:** `display`, `title`, `heading`, `subheading`, `body`, `label`,
  `caption`, `mono`. Each role binds to a size, weight, tracking, and
  line-height — components request roles, not raw sizes.

### 20. Spacing & Grid

- **Base:** 4.
- **Layout grid:** 12-column, 72px max column, 24px gutter, `clamp(16px,
  4vw, 96px)` outer padding.
- **Section rhythm:** 96 / 128 / 160 vertical (mobile / tablet / desktop).
- **Component padding:** derived from density; documented per component.

### 21. Radius

`--radius-xs` 4 · `sm` 6 · `md` 8 · `lg` 12 · `xl` 16 · `2xl` 20 · `3xl` 28 ·
`full` 9999. All squircle-drawn where the platform supports it (SVG masks,
future CSS `corner-shape`).

### 22. Elevation & Shadow Recipes

Six levels, each with (contact, ambient, moon-edge, border) tuples. Full
values live in `packages/tokens`. Every recipe uses `color-mix` against the
surface token beneath — shadows *belong* to their context.

### 23. Blur, Noise, Texture

- **Blur scale:** 0 / 8 / 16 / 24 / 40. Budgeted; never nested.
- **Noise:** a 0.5% opacity monochrome SVG grain, applied to command veils,
  hero surfaces, and empty states. Prevents banding on dark gradients.
- **Texture:** none by default. Marketing surfaces may opt in to a subtle
  paper grain; product surfaces never.

### 24. Border Styles

- **Hairline** (1px, `--color-border`) — separators, resting inputs.
- **Strong** (1px, `--color-border-strong`) — hover inputs, selected cards.
- **Accent** (1.5px, `--color-primary`) — selected primary, focus-within
  containers.
- **Dashed** reserved for empty containers and drop zones only.

### 25. Surface Layers

Canvas → Surface → Raised → Overlay → HUD. Each has a token, a shadow
recipe, a border token, and a text-role palette. Nesting rules are enforced
by `nova lint`.

### 26. Cards, Containers, Panels

Cards use **Surface** or **Raised**, radius `lg`/`xl`, padding on a 4/8-beat.
Interactive cards get the Halo Hover; static cards do not. Panels (persistent
navigation regions) never elevate above Surface.

### 27. Buttons — the archetype for all controls

- Heights: 28 / 32 / 36 / 40 / 48.
- Corner: control family.
- Variants: `primary`, `secondary`, `ghost`, `outline`, `subtle`,
  `destructive`, `link`. Sizes and variants compose; states are shared.
- Icon spacing: 8 to label at md, 6 at sm, 10 at lg.
- Motion: 120ms rest↔hover, 80ms press, spring on focus ring.

### 28. Inputs

Single-line, textarea, select, combobox, number, search, otp, tag, file.
Shared anatomy: `label / control / affix / hint / error`. Focus uses the
Nova Ring; error uses ring + border, never color-only. Placeholder is
tertiary text, never a label substitute.

### 29. Data Visualization

- **Palette:** 8-color categorical, generated in OKLCH to be equal-weight
  and colorblind-safe. Sequential and diverging scales derived from brand.
- **Axes:** hairline, tertiary color. Grid lines only when values must be
  read precisely.
- **Type:** tabular, mono for values, sans for labels.
- **Motion:** enter animations under 400ms, staggered by 20ms per series.
- **Empty:** the Silent Empty pattern; no illustrations in charts.

### 30. Icons & Illustration

- **Icons:** Nova Icon Grid (§17.13), 24 base with 16/20/32 optical variants.
- **Illustration:** used only for onboarding and empty states in marketing
  contexts; monochrome or two-tone; drawn on the same grid as icons.

### 31. Motion System

- **Duration scale:** `instant` 80 / `fast` 140 / `base` 200 / `slow` 320 /
  `slower` 480.
- **Easing:** `standard` cubic-bezier(.2,.8,.2,1); `enter` (.16,1,.3,1);
  `exit` (.4,0,1,1); `emphasized` (.2,0,0,1); plus spring presets `snap`
  (300/28), `soft` (200/30), `glide` (170/22).
- **Choreography:** parent leads, children follow with ≤40ms stagger.
- **Reduced motion:** durations halve; springs become linear-in-place; no
  translation greater than 4px.

### 32. Feedback

- **Toasts:** overlay level 5, bottom-right (or top-center on mobile), auto-
  dismiss default 5s, pausable on hover/focus.
- **Inline:** error text below control, success as a check affix inside the
  control.
- **System:** status bar at the top of app shell, hidden when idle.
- **Sound:** none by default; opt-in only, never for errors.

### 33. Navigation

- **Global:** app shell with sidebar (persistent), topbar (contextual),
  command palette (universal).
- **Local:** breadcrumbs use the mono numeral for IDs; tabs use the accent
  underline (2px, squircle-cap).
- **State:** current route always has the accent underline *and* elevated
  contrast, never one or the other.

### 34. Empty, Loading, and Error States

The three most-neglected screens are first-class in Nova.

- **Empty:** Silent Empty (§17.14). One tertiary action.
- **Loading:** Nova Loading Bar for global; **skeleton with 1s shimmer** for
  content; **pending affix** (spinner inside the triggering control) for
  in-place actions.
- **Error:** honest sentence, one primary retry, one secondary escape.
  Never a full-page cartoon.

### 35. AI Components — first-class

- **Chat surface:** two roles, quiet formatting, monospace for code.
- **Streaming:** the AI Stream Halo (§17.15) + character-batched render
  (never per-token DOM churn).
- **Prompt input:** grows to 8 lines then scrolls; slash-menu on `/`;
  attachment tray inline.
- **Tool call display:** collapsed by default, expandable to raw JSON.
- **Citations:** superscript sigils, hoverable to source card.
- **Thinking indicator:** three-dot ellipsis with breath at 0.6Hz — same
  frequency as the halo, so both feel like one system.

### 36. Design Tokens (structural)

Three-layer model (§18) applied across color, type, space, radius, shadow,
motion, and z-index. Every token has:

- a **name** (kebab-case, semantic),
- a **type** (DTCG),
- a **description** (why it exists),
- a **mode map** (light, dark, and any brand modes),
- a **fallback chain** for platforms without OKLCH.

Tokens are the API of the design language. Renaming a token is a breaking
change.

### 37. Density

Three settings: `comfortable` (default), `cozy` (-2 to -4px on controls and
padding), `compact` (data-dense grids, tables). Density never changes type
scale or radius; only heights and paddings.

---

## Part IV — Emotional Design Matrix

Every component declares one primary emotion. This ships in its spec and
audits during design review.

| Component | Emotion | Design consequence |
|---|---|---|
| Primary button | Confidence | Firm shadow, decisive motion, saturated brand |
| Secondary button | Composure | Neutral, low shadow, honest border |
| Input | Trust | Generous height, clear focus, no surprises |
| Dialog | Focus | Scrim, aperture entrance, strong contrast |
| Toast | Reassurance | Brief, warm, dismissible |
| Command palette | Power | Fast, mono, keyboard-only affordances shown |
| Empty state | Calm | Silence, one line, one tertiary action |
| Chart | Clarity | Tabular numerals, hairline axes, no chartjunk |
| AI message | Presence | Breathing halo, ink cursor, warm content surface |
| Error | Honesty | Plain sentence, actionable, no anthropomorphism |

---

## Part V — Detail Obsessions

Nova sweats these because most libraries don't.

- **Optical alignment.** Icons inside buttons align to type x-height, not to
  the bounding box. Round shapes overshoot squares by 2%.
- **Cursor transitions.** Cursors change at layer boundaries — text over
  text, grab over draggable, help over annotated numerals.
- **Selection styling.** `::selection` uses the brand color at 24% alpha —
  a Nova signature that reads instantly in screenshots.
- **Scrollbars.** Custom, 6px, translucent, appear on scroll, fade in 200ms,
  fade out 800ms. Trackless. Same in both modes.
- **Focus restoration.** Closing a dialog returns focus to its opener; a
  navigation restores scroll on back only, not on forward.
- **Text rendering.** `text-rendering: optimizeLegibility` on display type
  only (perf); `font-feature-settings: "ss01","cv11","tnum"` on numerals.
- **Touch targets.** 44px minimum, even when the visual is 32.
- **Loading anticipation.** Actions likely to take >200ms show a pending
  affix at 100ms, not at completion.
- **Animation choreography.** No two animations start on the same frame
  unless they belong to the same system.
- **Corner smoothing.** Squircle everywhere or nowhere. Never mixed.
- **Baseline rhythm.** Body prose sits on a 4-beat baseline; UI does not
  attempt baseline grid — it uses vertical rhythm from line-height instead.
- **Sound of silence.** No system beeps. No haptics on desktop. Haptics on
  mobile only for destructive confirmations and drag-end.

---

## Part VI — Platforms & Contexts

Nova is designed once, translated deliberately.

- **Desktop web:** the reference platform. Everything here first.
- **Mobile web:** density snaps to `comfortable`; touch targets enforced;
  hover states convert to press. No hover-only affordances.
- **Native mobile (future):** the language survives; primitives are re-
  authored for platform conventions (navigation, sheets, haptics).
- **Large screens & TV:** grid extends to 16 columns; type scale gains a
  `display-xl`; focus ring thickens by 1px for viewing distance.
- **Touch tablets:** density `comfortable`; drag handles gain visible
  affordances.
- **VisionOS-style spatial:** surfaces adopt the Glass Philosophy at higher
  blur; the moon-edge doubles as the primary elevation cue; shadows soften
  and gain parallax; motion durations extend by 1.2×.
- **Print / PDF:** neutrals become true black on true white; shadows drop
  to hairlines; the type scale compresses one step; brand color is retained
  only on primary CTAs.
- **Forced colors mode:** all component styles are authored with system
  colors as first-class; no visual regressions.

---

## Part VII — Governance

- **The Council.** A small group of maintainers owns this document. Changes
  are PRs against this file, reviewed by at least two Council members.
- **Deprecations.** A token, name, or pattern is deprecated in one release,
  removed no sooner than two. Codemods ship with the deprecation.
- **The Screenshot Test.** Every quarter, five screenshots of Nova apps are
  shown to five people who have never seen the library. If fewer than three
  can identify the shared origin, the language has drifted — Council convenes.
- **The Nova Constant.** Between any two Nova releases, a component should
  look and feel like the same object aged, not a different object.

---

## Part VIII — Non-Goals

- Not a theme marketplace.
- Not a page builder.
- Not a place to try trends (glassmorphism blooms, neumorphism, brutalist
  irony) that don't survive the Screenshot Test.
- Not a mirror of any single product's aesthetic. Nova borrows *rigor*
  from Apple, Linear, Vercel, Raycast, Framer, Stripe — it borrows *style*
  from none of them.

---

## Part IX — The Nova Oath

> Draw only what carries weight.
> Move only to explain.
> Color only to guide.
> Depth only when the eye needs it.
> Speak only when the user needs to hear.
> Every pixel earns its place, or it goes.
