<div align="center">

# Novix UI

**Premium, animated, accessible React components for SaaS, AI, and dashboards.**

A modern component library engineered with the craft of Vercel, Linear, Stripe, Framer, Apple, and Raycast — built on React 19, Tailwind v4, Radix Primitives, and Motion.

<p>
  <a href="https://github.com/novix-ui/novix-ui/stargazers"><img src="https://img.shields.io/github/stars/novix-ui/novix-ui?style=for-the-badge&logo=github&color=fbbf24" alt="Stars" /></a>
  <a href="https://github.com/novix-ui/novix-ui/network/members"><img src="https://img.shields.io/github/forks/novix-ui/novix-ui?style=for-the-badge&logo=github&color=8b5cf6" alt="Forks" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-06b6d4?style=for-the-badge" alt="MIT License" /></a>
  <a href="https://www.npmjs.com/package/@novix-ui/react"><img src="https://img.shields.io/npm/v/@novix-ui/react?style=for-the-badge&logo=npm&color=cb3837" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/@novix-ui/react"><img src="https://img.shields.io/npm/dm/@novix-ui/react?style=for-the-badge&logo=npm&color=10b981" alt="Downloads" /></a>
  <img src="https://img.shields.io/bundlephobia/minzip/@novix-ui/react?style=for-the-badge&color=ec4899" alt="Bundle Size" />
  <img src="https://img.shields.io/github/actions/workflow/status/novix-ui/novix-ui/ci.yml?style=for-the-badge&logo=github" alt="Build Status" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
</p>

[**Documentation**](/docs) · [**Components**](/docs/components) · [**Playground**](/docs/playground) · [**Recipes**](/docs/recipes) · [**Migration**](/docs/migration)

</div>

---

## ✨ Overview

**Novix UI** is a production-grade React component library designed for teams building SaaS products, AI applications, developer tools, and data-dense dashboards. It combines the composability of Radix, the token-driven theming of a design system, and signature motion inspired by Apple and Linear — without the visual sameness of typical component kits.

### Why Novix UI?

- **Design fidelity that ships.** Signature effects like *Moon-Edge*, *Halo Hover*, and *Press Sink* are engineered into every primitive, not bolted on.
- **Accessibility as a baseline, not a feature.** Every component targets WCAG AA, ships keyboard navigation, and supports reduced-motion.
- **Token-driven theming.** OKLCH color space, semantic tokens, and a single CSS layer make dark mode and custom brands trivial.
- **Composable primitives.** Slot architecture (via Radix `asChild`) lets you compose without wrapping.
- **Zero visual clichés.** No default purple gradients on white. Reject generic AI aesthetics; commit to a distinctive visual voice.

### Target Audience

- Product teams building **SaaS dashboards** and internal tools
- **AI/LLM interfaces** that need premium polish (chat, agents, workflows)
- **Startup marketing sites** that need to look shipped, not templated
- Design-conscious engineers who want **Radix under the hood** with Novix's craft on top

---

## 🚀 Features

- 🎨 **65+ production components** — full coverage from Button to Command Palette
- 🌗 **Dark mode by default** — semantic tokens, OKLCH color space, `prefers-color-scheme` aware
- ♿ **WCAG AA baseline** — ARIA, focus rings, keyboard nav, screen reader labels
- 🎬 **Signature motion system** — Moon-Edge highlights, Halo Hover tracking, Press Sink physics
- 🧩 **Radix primitives** — accessibility, keyboard, and focus management from the trusted foundation
- 🧠 **TypeScript-first** — strict types, polymorphic components, exhaustive variant unions
- 🎭 **CVA variants** — `class-variance-authority` for predictable, tree-shakeable style APIs
- ⚡ **Zero side effects** — fully tree-shakeable ESM, minimal runtime, no CSS-in-JS overhead
- 🪄 **Motion One / Framer** — spring physics, layout transitions, gesture support
- 📱 **Responsive & mobile-ready** — every component tested on mobile viewports
- 🎨 **Tailwind v4 native** — `@theme` tokens, native CSS layers, no legacy config file
- 🧰 **CLI included** — `npx @novix-ui/cli add button card dialog`
- 📚 **World-class docs** — playground, recipes, migration guides, keyboard-driven search
- ✅ **Tested** — Playwright visual regression, hydration, clipboard, accessibility suites

---

## 🧱 Component Library

<details>
<summary><strong>Foundation</strong> — buttons, inputs, layout</summary>

| Component | Description |
|---|---|
| `Button` | Layered surfaces, tactile press physics, 8 variants |
| `IconButton` | Square icon-only button with loading state |
| `Input` | Text input with slots for adornments and validation |
| `Textarea` | Auto-resizing textarea with character count |
| `Label` | Semantic label with `required`/`optional` markers |
| `Card` | Composable card (`Header`, `Body`, `Footer`) with Moon-Edge |
| `Separator` | Horizontal/vertical divider with optional label |
| `AspectRatio` | Radix-backed aspect ratio container |
| `Layout` | Stack, Grid, Cluster primitives |

</details>

<details>
<summary><strong>Feedback</strong> — status, loaders, alerts</summary>

| Component | Description |
|---|---|
| `Badge` | Status badge with dot, 6 tones |
| `Alert` / `AlertDialog` | Inline alerts and modal confirmations |
| `Toast` | Sonner-powered toast system |
| `Progress` / `ProgressCircle` | Determinate/indeterminate progress |
| `Skeleton` | Text, circle, rect shapes with shimmer |
| `Spinner` | Tuned sizes, tones, and `aria-label` |
| `Status` | Live status indicator (online, degraded, offline) |
| `Announcement` | Marketing announcement bar |
| `EmptyState` | Empty-state illustration + CTA |

</details>

<details>
<summary><strong>Overlays</strong> — dialogs, popovers, menus</summary>

| Component | Description |
|---|---|
| `Dialog` / `AlertDialog` | Radix modal with focus trap |
| `Sheet` / `Drawer` | Side-panel and bottom-sheet |
| `Popover` / `HoverCard` | Positioned floating surfaces |
| `Tooltip` | Delayed tooltip with arrow |
| `DropdownMenu` / `ContextMenu` / `Menubar` | Full menu suite |
| `Command` | `cmdk` command palette with fuzzy search |

</details>

<details>
<summary><strong>Forms</strong> — controlled, validated, accessible</summary>

| Component | Description |
|---|---|
| `Checkbox` / `RadioGroup` / `Switch` | Radix-backed form controls |
| `Select` / `Combobox` | Native and searchable selects |
| `Slider` | Range slider with keyboard support |
| `DatePicker` / `Calendar` / `TimePicker` | `react-day-picker` powered date suite |
| `PinInput` | OTP-style input |
| `FileUpload` | Drag-and-drop file input |
| `Rating` | Star rating input |
| `ColorPicker` | HSL/OKLCH color picker |

</details>

<details>
<summary><strong>Navigation</strong> — nav, tabs, breadcrumbs</summary>

| Component | Description |
|---|---|
| `NavigationMenu` | Radix mega-menu |
| `Tabs` | Spring-animated pill with gradient active state |
| `Accordion` | Collapsible sections |
| `Pagination` | Numbered pagination with ellipsis |
| `Breadcrumb` | Path breadcrumbs |
| `Stepper` / `Steps` | Multi-step flows |
| `Timeline` | Vertical timeline |
| `Tree` | Recursive tree view |

</details>

<details>
<summary><strong>Data Display</strong> — tables, avatars, media</summary>

| Component | Description |
|---|---|
| `Table` | Data table with sorting slots |
| `Avatar` / `AvatarGroup` | Squircle-masked avatars with fallback |
| `Kbd` / `KbdSequence` | Keyboard shortcut display |
| `Snippet` | Copyable code snippet |
| `Statistic` | Metric display for dashboards |
| `Marquee` / `Ticker` | Infinite scrolling banners |
| `ScrollArea` | Styled scroll container |
| `Comparison` | Before/after image slider |
| `Cursor` | Custom cursor primitive |

</details>

<details>
<summary><strong>Effects</strong> — visual primitives</summary>

Aurora, Meteors, Grid, Dots, Beams, Spotlight, BentoTile, GlareCard, TiltCard, and more from `@novix-ui/react/effects`.

</details>

---

## 📦 Installation

```bash
npm  install @novix-ui/react
pnpm add     @novix-ui/react
yarn add     @novix-ui/react
bun  add     @novix-ui/react
```

**Peer dependencies:** `react@^18 || ^19`, `react-dom@^18 || ^19`, `tailwindcss@^4`.

### Setup

```ts
// src/main.tsx
import "@novix-ui/react/styles.css";
```

### CLI

```bash
novix init          # scaffold tokens + tailwind config
novix add button    # copy a component into your project
novix doctor        # diagnose install issues
```

---

## 💡 Usage

### Basic

```tsx
import { Button, Card, ThemeProvider } from "@novix-ui/react";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Card variant="elevated">
        <Card.Header>
          <Card.Title>Welcome</Card.Title>
          <Card.Description>Composable primitives.</Card.Description>
        </Card.Header>
        <Card.Body>
          <Button variant="primary">Launch</Button>
        </Card.Body>
      </Card>
    </ThemeProvider>
  );
}
```

### Variants

```tsx
<Button variant="primary" size="lg" leadingIcon={<Sparkles />}>Generate</Button>
<Button variant="secondary" loading>Saving</Button>
<Button variant="ghost" asChild><a href="/pricing">Pricing</a></Button>
```

### Composition via `asChild`

```tsx
<Button asChild>
  <Link to="/dashboard">Open dashboard</Link>
</Button>
```

### Custom theme

```css
/* your app's global.css */
@import "@novix-ui/react/styles.css";

@theme {
  --color-primary: oklch(0.68 0.19 265);
  --color-accent:  oklch(0.75 0.18 190);
  --radius-md: 0.75rem;
}
```

---

## 🛠 Tech Stack

| Category | Technologies |
|---|---|
| **Runtime** | React 19, TypeScript 5 (strict) |
| **Styling** | Tailwind CSS v4, `tw-animate-css`, `tailwind-merge`, `clsx` |
| **Primitives** | Radix UI (28+ packages), `cmdk`, `vaul`, `input-otp` |
| **Motion** | Motion (Framer Motion successor) |
| **Variants** | `class-variance-authority` |
| **Icons** | Lucide React |
| **Forms** | `react-hook-form`, `@hookform/resolvers`, Zod |
| **Data** | `@tanstack/react-query`, `date-fns`, `recharts` |
| **Framework** | TanStack Start + Vite 7 (docs site) |
| **Toasts** | Sonner |
| **Tooling** | ESLint 9, Prettier, `tsgo`, Playwright |

---

## 🗂 Project Structure

```
novix-ui/
├── src/
│   ├── nova/                     # Core library (published as @novix-ui/react)
│   │   ├── ui/                   # 65+ component primitives
│   │   ├── tokens/               # Design tokens (OKLCH, spacing, radius)
│   │   ├── themes/               # ThemeProvider + presets
│   │   ├── animations/           # Motion presets & spring configs
│   │   ├── icons/                # Icon system
│   │   └── utils/                # cn(), polymorphic helpers
│   ├── routes/                   # Documentation site (TanStack Start)
│   │   ├── docs.*.tsx            # 70+ doc pages
│   │   └── elements.tsx          # Element gallery
│   ├── components/docs/          # Docs-specific components (playground, code block)
│   └── data/                     # 1000+ showcase elements
├── packages/
│   ├── react/                    # Publishable npm package
│   └── cli/                      # @novix-ui/cli
├── docs/                         # Engineering & design specs
├── tests/                        # Playwright visual + integration
└── scripts/                      # Snippet validator, CI helpers
```

---

## 🎨 Design System

Novix UI is driven by a **semantic token layer** — never hardcode colors in components.

- **Color:** OKLCH color space for perceptual uniformity across dark/light modes
- **Typography:** Fluid type scale, tabular numerals for data
- **Spacing:** 4pt base grid with harmonic multipliers
- **Radius:** `sm`, `md`, `lg`, `xl`, `2xl`, `full` — semantic, not pixel-locked
- **Shadow:** 5-layer shadow stack (Moon-Edge, halo, ambient, key, contact)
- **Motion:** Spring physics (`fast`, `smooth`, `bounce`, `gentle`)
- **Breakpoints:** `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`

See [`docs/DESIGN_LANGUAGE.md`](./docs/DESIGN_LANGUAGE.md) and [`docs/ENGINEERING_SPEC.md`](./docs/ENGINEERING_SPEC.md).

---

## 🌗 Theming

```tsx
import { ThemeProvider } from "@novix-ui/react";

<ThemeProvider defaultTheme="system" storageKey="novix-theme">
  <App />
</ThemeProvider>
```

- `defaultTheme`: `"light" | "dark" | "system"`
- Override any token via CSS `@theme` block
- Runtime theme switching without FOUC (SSR-safe via `useHydrated`)
- Build custom brand themes with `@novix-ui/theme-generator`

---

## ♿ Accessibility

- ✅ **WCAG 2.1 AA** color contrast on all defaults
- ✅ **Keyboard-first** — every interactive component navigable without a mouse
- ✅ **Focus rings** visible on `:focus-visible`, respect `prefers-reduced-motion`
- ✅ **ARIA** roles, labels, and live regions on all overlays
- ✅ **Screen reader** tested with VoiceOver and NVDA
- ✅ **Radix foundations** for focus trap, dismiss stack, and portal management

---

## ⚡ Performance

- 📦 **Tree-shakeable** — `sideEffects: false`, per-component ESM entries
- 🪶 **Lightweight** — zero runtime CSS, no styled-components/emotion overhead
- 🚀 **Lazy-loadable** — every component is a discrete import
- ⚙️ **SSR-safe** — hydration-verified across 71 routes via Playwright
- 🎯 **Lighthouse 95+** on docs site

---

## 📖 Documentation

- **[Component docs](/docs/components)** — API, props, examples
- **[Playground](/docs/playground)** — interactive editor
- **[Recipes](/docs/recipes)** — auth, dashboards, forms, command palette
- **[Migration guides](/docs/migration)** — from shadcn, Chakra, MUI, Ant, Tailwind UI, Bootstrap
- **[Accessibility](/docs/accessibility)** · **[Motion](/docs/motion)** · **[CLI](/docs/cli)**

---

## 🗺 Roadmap

- [x] Foundation primitives (Button, Input, Card, Badge, Separator)
- [x] Radix-backed overlays (Dialog, Popover, Dropdown, Sheet, Drawer)
- [x] Motion system (Moon-Edge, Halo Hover, Press Sink, Tilt, Parallax)
- [x] Command palette (`Cmd+K`) with global search
- [x] Docs platform with playground, snippets, migration guides
- [x] CLI (`init`, `add`, `doctor`)
- [x] Dark mode + OKLCH tokens
- [x] Playwright visual + accessibility regression suite
- [ ] Charts primitives (`@novix-ui/charts`)
- [ ] AI-native components (Chat, Agent, PromptInput, Stream)
- [ ] Figma → Novix token sync
- [ ] React Native adapter
- [ ] Theme marketplace

---

## 🤝 Contributing

Contributions are warmly welcomed! See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

```bash
git clone https://github.com/novix-ui/novix-ui.git
cd novix-ui
bun install
bun dev
```

**Conventions:**
- **Branches:** `feat/<name>`, `fix/<name>`, `docs/<name>`, `refactor/<name>`
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`)
- **PRs:** small, focused, with a screenshot/GIF for UI changes
- **Style:** ESLint + Prettier enforced via CI

---

## 📄 License

[MIT](./LICENSE) © Novix UI contributors.

---

## 🙏 Acknowledgements

Standing on the shoulders of giants:

- **[Radix UI](https://www.radix-ui.com/)** — the unshakeable primitive foundation
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** — inspired our composition patterns
- **[Aceternity UI](https://ui.aceternity.com/)** · **[Magic UI](https://magicui.design/)** — visual primitive inspiration
- **[Mantine](https://mantine.dev/)** · **[Chakra UI](https://chakra-ui.com/)** · **[NextUI](https://nextui.org/)** — API design references
- **[Motion](https://motion.dev/)** — physics-based animation
- **[Vercel](https://vercel.com/)**, **[Linear](https://linear.app/)**, **[Stripe](https://stripe.com/)**, **[Raycast](https://raycast.com/)**, **[Framer](https://framer.com/)**, **[Apple](https://apple.com/)** — craft benchmarks

---

## 📬 Contact

- **GitHub:** [github.com/Pcmhacker-hero/novixui](https://github.com/Pcmhacker-hero/novixui)
- **Docs:** [novixui.dev](https://novixui.dev)
- **NPM:** [npmjs.com/package/@novix-ui/react](https://www.npmjs.com/package/@novix-ui/react)
- **X / Twitter:** [@pcmeena511](https://x.com/pcmeena511)
- **LinkedIn:** [prakash-meena-a46906324](https://linkedin.com/in/prakash-meena-a46906324)
- **Email:** _hello@novixui.dev_

<div align="center">

**Built with obsession for craft. Star ⭐ if it helped you ship.**

</div>
