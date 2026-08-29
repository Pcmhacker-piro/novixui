# Novix UI — AI-Native Positioning

> Novix UI is the modern component system for **AI products, SaaS applications, and developer tools**.
> AI-native components are first-class citizens — designed, specified, tested, and documented to the same standard as `Button` and `Input`, not bolted on as an optional add-on.

This document is the source of truth for **what makes Novix UI different**. It amends the [Roadmap](./ROADMAP.md), sits alongside the [Design Principles](./DESIGN_PRINCIPLES.md), the [Universal Component Specification](./COMPONENT_SPECIFICATION.md), the [API Philosophy](./API_PHILOSOPHY.md), the [Testing Strategy](./TESTING_STRATEGY.md), and the [Documentation Standards](./DOCUMENTATION_STANDARDS.md), and takes precedence over them where AI-specific requirements conflict.

---

## Positioning Statement

Every other component library was designed for the CRUD web — forms, tables, dashboards. Novix UI ships those, and it ships the primitives the CRUD-era libraries never had: streaming text, tool calls, agent workflows, model selection, citations, thinking indicators.

**We are the first component library where you can build a production chat product, an agent console, or an AI-powered SaaS surface without reinventing the AI primitives yourself.**

Positioning claims (must remain true through every release):

- **AI-native, not AI-adjacent.** AI components are in the core library, not a `@novix-ui/experimental-ai` side package.
- **Framework-agnostic AI.** Novix UI does not require the AI SDK, LangChain, or any specific model provider. Bring your own transport; Novix UI renders it.
- **Production-grade on day one.** Streaming, tool calls, citations, and workflows are held to the same a11y, performance, and testing bar as any other component.
- **Every AI surface is composable.** No god-components. `<Chat>` doesn't exist. `Chat.Transcript`, `Chat.Composer`, `Message`, `StreamingText`, `ToolCall` do.

**Rule:** If a positioning claim stops being true, we fix the library — we don't soften the positioning.

---

## First-Class AI Components

These ten components are Novix UI's differentiators. They are:

- Included in the **core library** (`@novix-ui/react`), not a separate package.
- Documented alongside every other component (same 14-section structure).
- Tested to the same standard (all nine testing layers).
- Prioritized in the roadmap — **v0.7 (SaaS Specials) and v0.8 (AI Surfaces) are non-negotiable milestones on the path to v1.0**.
- Guaranteed by v1.0 semver.

| # | Component | Category | Ships in |
|---|-----------|----------|----------|
| 1 | Chat Interface (`Chat.*` compound) | AI Surface | v0.8 |
| 2 | Streaming Message (`StreamingText`) | AI Surface | v0.8 |
| 3 | Prompt Input (`ChatComposer`) | AI Surface | v0.8 |
| 4 | Agent Card | AI Surface | v0.8 |
| 5 | Model Selector | AI Surface | v0.8 |
| 6 | Thinking Indicator | AI Surface | v0.8 |
| 7 | Citation Block | AI Surface | v0.8 |
| 8 | Markdown Viewer | AI Surface | v0.8 |
| 9 | Tool Call Display | AI Surface | v0.8 |
| 10 | Workflow Timeline | AI Surface | v0.8 |

---

## Component Briefs

Each brief is a pre-spec sketch — enough to lock scope, not enough to substitute for the full Universal Component Specification. Every component below will have its own spec document under `docs/components/` before implementation begins.

### 1. Chat Interface (`Chat.*`)

**Purpose.** A compound component providing the canonical structure of a chat product: scrollable transcript, sticky composer, empty state, scroll-to-bottom affordance.

**Shape.** Compound: `Chat.Root`, `Chat.Transcript`, `Chat.Empty`, `Chat.ScrollButton`, `Chat.Composer`. Each subcomponent follows the canonical API surface — `variant`, `size`, `asChild`, `className`, `data-slot`.

**Key requirements.**
- Sticky-to-bottom transcript that stays anchored while streaming, releases on user scroll, and offers an explicit "scroll to latest" affordance.
- Empty state slot (illustration, headline, suggestion chips).
- Transport-agnostic — accepts an array of messages; does not couple to a specific SDK.
- Full keyboard model: `PageUp`/`PageDown` scroll, `⌘K` opens command palette if provided, composer focus survives thread switching.

**Non-goals.** No message persistence. No thread routing. No model call. Those belong to the app.

---

### 2. Streaming Message (`StreamingText`)

**Purpose.** Render a stream of tokens as they arrive — with a cursor, respect for reduced motion, and screen-reader-friendly announcement on semantic boundaries (sentence, paragraph), not per token.

**Shape.** `<StreamingText source={tokenIterator} />` or `<StreamingText text={liveString} isStreaming />`.

**Key requirements.**
- 60fps at realistic token rates (30–100 tokens/s).
- Cursor blink via `snap` motion preset; collapses to static under reduced motion.
- SR announcement debounced to sentence boundaries — never per token.
- Supports incremental markdown rendering (see Markdown Viewer) without re-parsing on every token.
- Explicit `onComplete` callback fires exactly once when streaming ends.

**Non-goals.** Does not fetch. Does not manage the stream lifecycle. Consumer owns the source.

---

### 3. Prompt Input (`ChatComposer`)

**Purpose.** The input surface for chat: auto-resizing textarea, attachment slot, send/stop states, submit-on-Enter with Shift+Enter newline.

**Shape.** Compound: `ChatComposer.Root`, `ChatComposer.Textarea`, `ChatComposer.Attachments`, `ChatComposer.Toolbar`, `ChatComposer.Submit`.

**Key requirements.**
- `status: "idle" | "submitted" | "streaming"` prop drives Submit button state (send icon → stop icon during streaming).
- Auto-focus on mount, after send, after stream complete, after thread switch — unless focus is intentionally elsewhere (modal, popover).
- IME-safe: never submits during composition.
- Mobile: keyboard-aware, no viewport jump, `virtualkeyboard` API where supported.
- Attachments slot renders any content (images, files, tool selectors) via `startContent` / `endContent`.

**Non-goals.** Does not manage message state. Does not call the model.

---

### 4. Agent Card

**Purpose.** A canonical card for representing an AI agent, assistant, or model persona — name, avatar, description, status, action.

**Shape.** Compound: `AgentCard.Root`, `AgentCard.Avatar`, `AgentCard.Identity` (name + role), `AgentCard.Description`, `AgentCard.Status`, `AgentCard.Actions`.

**Key requirements.**
- Variants: `default`, `compact` (list rows), `feature` (marketing surfaces), `selectable` (grid picker).
- Status dot follows `Badge`'s `StatusDot` primitive — semantic, not decorative.
- Selectable variant is a real `<button>` with `aria-pressed`, not a `div` with `onClick`.
- Composes cleanly inside `Card`, `Popover`, `DropdownMenu`.

**Non-goals.** Not a settings panel. Not a chat header. Those are composed from Agent Card + other primitives.

---

### 5. Model Selector

**Purpose.** Pick a model from a list — with tier, cost, and capability metadata visible at the moment of choice.

**Shape.** Built on `Combobox` with AI-specific slots: model name, provider, badge for tier (free/pro/enterprise), capability icons (vision, tools, streaming), context window, cost per 1K tokens.

**Key requirements.**
- Grouped by provider by default; groupable by capability or tier.
- Keyboard-first: typeahead, arrow navigation, `Enter` selects.
- Compact trigger (fits in a chat composer toolbar) and expanded trigger (fits in a settings row).
- Async loading state for dynamic model catalogs.
- Zero coupling to any specific model provider — accepts a `models` array.

**Non-goals.** Does not fetch model lists. Does not persist selection.

---

### 6. Thinking Indicator

**Purpose.** Communicate that the model is *working* — before the first token arrives, and during long tool calls.

**Shape.** `<ThinkingIndicator variant="shimmer" label="Thinking…" />` with variants: `shimmer` (text with animated gradient), `dots` (bouncing dots), `pulse` (subtle breathing dot), `reasoning` (expandable panel showing intermediate reasoning steps).

**Key requirements.**
- Uses the shared `snap`/`soft` motion presets — no custom keyframes.
- `aria-live="polite"` announces state changes ("Thinking", "Searching the web", "Analyzing").
- Reduced motion: collapses to a static "Thinking…" label.
- Reasoning variant is collapsible, closed by default, follows the standard tool-call disclosure pattern.

**Non-goals.** Not a spinner. `Spinner` remains the generic loading primitive.

---

### 7. Citation Block

**Purpose.** Attach sources to model output — inline citation markers plus an expandable source list.

**Shape.** Compound: `Citation.Root`, `Citation.Marker` (the `[1]` in text), `Citation.List`, `Citation.Item`.

**Key requirements.**
- Markers are real `<button>`s with `aria-describedby` pointing to the corresponding source item.
- Hovering a marker previews the source via `HoverCard`; clicking scrolls the list into view and focuses the item.
- Sources include: title, URL, snippet, favicon, retrieval timestamp, confidence badge (optional).
- Works inline with `StreamingText` — markers stream in as the model emits them.
- Deep-linkable: `#citation-3` scrolls and highlights.

**Non-goals.** Does not verify claims. Does not fetch sources.

---

### 8. Markdown Viewer

**Purpose.** Render model output as rich, safe markdown — the default rendering surface for every assistant message.

**Shape.** `<Markdown>{content}</Markdown>` with optional slot overrides for code blocks, links, images, tables.

**Key requirements.**
- GFM by default: tables, task lists, strikethrough, autolinks.
- Sanitized by default. Raw HTML is off unless explicitly enabled.
- Code blocks use Novix UI's `Code` component with syntax highlighting, copy button, and language label.
- Streaming-safe: incremental parsing without visual flicker; partial markdown (e.g. an unclosed code fence) renders gracefully.
- Links open in a new tab with `rel="noopener noreferrer"` by default; consumer can override per-link via slot.
- Images use `aspect-*` wrappers to prevent CLS.
- Tables render inside a `ScrollArea` on narrow viewports.

**Non-goals.** Not a full CMS renderer. Not a rich text editor. Not a math renderer by default (KaTeX/MathJax pluggable via slot).

---

### 9. Tool Call Display

**Purpose.** Show the model's tool invocations — name, status, inputs, outputs — inline in a message.

**Shape.** Compound: `ToolCall.Root`, `ToolCall.Header` (icon + name + status), `ToolCall.Input`, `ToolCall.Output`, `ToolCall.Error`.

**Key requirements.**
- Status states: `pending`, `running`, `success`, `error`, `cancelled` — each with distinct visual treatment.
- Collapsible; **closed by default** for all states (including success and error) unless the consumer opts in.
- Domain-aware output slots: consumer can register custom renderers per tool name (e.g. `web_search` → search results card, `sql_query` → table, `image_gen` → image grid).
- Inputs shown as syntax-highlighted JSON by default; consumers can render them richly via a slot.
- Streaming-friendly: renders `pending` before inputs arrive, `running` while executing, then flips to terminal state.
- Fully keyboard-accessible disclosure via the underlying `Collapsible` primitive.

**Non-goals.** Does not execute tools. Does not validate inputs. Does not know about specific tool APIs.

---

### 10. Workflow Timeline

**Purpose.** Visualize a multi-step agent workflow — plan, tool calls, reasoning, final output — as a scannable vertical timeline.

**Shape.** Compound: `Workflow.Root`, `Workflow.Step`, `Workflow.StepHeader`, `Workflow.StepContent`, `Workflow.Connector`.

**Key requirements.**
- Step statuses: `pending`, `active`, `completed`, `skipped`, `failed` — each with a distinct connector and icon.
- Dense variant for logs; expanded variant for interactive review.
- Each step is a landmark for keyboard navigation (`ArrowUp`/`ArrowDown` between steps).
- Composes with `ToolCall`, `StreamingText`, `Citation`, `Markdown` as step content.
- Live mode: appends new steps as an agent executes, respecting reduced motion.
- Sticky "current step" indicator on long workflows.

**Non-goals.** Does not orchestrate. Not a DAG editor.

---

## Roadmap Amendment

The [Roadmap](./ROADMAP.md) is amended as follows: **v0.8 is designated a non-negotiable milestone**. Novix UI does not reach v1.0 until all ten AI-native components ship to `stable` with full spec compliance.

Additionally:

- **v0.5 (Feedback & Status)** promotes `Spinner`, `Skeleton`, and `EmptyState` — these are prerequisites for every AI surface and must be rock-solid before v0.8.
- **v0.6 (Data Display)** must ship `Code` and `Kbd` with syntax highlighting and copy-to-clipboard — the Markdown Viewer depends on them.
- **v0.7 (SaaS Specials)** must ship `Combobox` with async loading and `Command` — Model Selector and any embedded assistant palettes depend on them.
- **v0.9 (Templates)** must include an `ai-chat` template that uses every AI-native component in a realistic surface, dogfooded on the docs site.

**Rule:** Any release that regresses an AI-native primitive is a release that does not ship.

---

## Cross-Cutting Requirements for AI Components

In addition to the standard [Component Specification](./COMPONENT_SPECIFICATION.md), every AI-native component must meet these AI-specific requirements:

### Transport Independence

- No AI component imports the AI SDK, LangChain, OpenAI, Anthropic, or any provider SDK.
- Streaming components accept iterators, async iterables, or live-updating strings — not `useChat` return values.
- Tool call and workflow components accept plain-object data — not framework-specific types.
- A worked example integrating with the AI SDK ships in docs, but the component does not depend on it.

### Streaming-First Design

- Every component that can receive live data does so without remounts, re-parses, or layout shift.
- Partial content renders gracefully (unclosed code fences, half-parsed JSON, incomplete citations).
- 60fps target on all streaming interactions at realistic token rates.

### Screen Reader Semantics for Live Content

- Streaming text announces on **semantic boundaries** (sentence, paragraph), not per token.
- Tool calls announce state transitions (`Searching the web… complete`), not internal implementation.
- Live regions use `aria-live="polite"` by default; `assertive` only for user-blocking states.
- Consumers can opt into per-token announcement via prop for accessibility-critical workflows.

### Content Safety

- Markdown rendering is sanitized by default. Enabling raw HTML requires an explicit prop and a docs warning.
- Links from model output default to `rel="noopener noreferrer"` and are marked with a "from model" indicator when the consumer opts in.
- Tool call output rendering is sandboxed — no arbitrary HTML execution.

### Reduced Motion

- Every animation (cursor blink, shimmer, streaming appearance, timeline transitions) collapses to instant or static under `prefers-reduced-motion: reduce`.
- No AI component **requires** motion to be understandable.

### Performance

- Streaming primitives budget **< 16ms per token** at 100 tokens/s on mid-range hardware.
- Markdown re-parse cost during streaming: **amortized O(new tokens)**, not O(total content).
- Timeline and transcript components virtualize when documented thresholds are exceeded (Timeline: > 50 steps; Transcript: > 200 messages).

### Testing

All nine layers from the [Testing Strategy](./TESTING_STRATEGY.md), plus:

- **Streaming fixture tests** — every streaming component tested against realistic token sequences, including malformed / partial content.
- **Provider-integration tests** — each AI component has at least one E2E test wired to a real (mocked at the network layer) AI SDK flow, proving it works in a real product context.
- **Accessibility under streaming** — axe-core runs on components in mid-stream states, not just final states.

---

## Governance

- The AI Surfaces group has a **named domain owner** — accountable for coherence across all ten components.
- New AI components require review from the domain owner in addition to design + engineering reviewers.
- The roadmap for AI components is public and RFC-driven from v1.0 onward — the AI ecosystem moves fast, and consumers must see what's coming.
- Deprecations follow the standard policy (two-minor-release notice, codemod required) — but AI components additionally require a migration example in the docs, since AI product code is often the most tightly coupled.

---

## Definition of Done, AI-Native Edition

An AI-native component ships to `stable` **only** when all of these are true, in addition to the standard component definition of done:

- [ ] Component is in the core `@novix-ui/react` package — not a side package.
- [ ] Component has no dependency on the AI SDK or any model provider SDK.
- [ ] Streaming behavior renders at 60fps with realistic token rates in benchmarks.
- [ ] Screen-reader announcements respect semantic boundaries, verified on VoiceOver + NVDA.
- [ ] Reduced-motion behavior verified.
- [ ] Content-safety behavior (sanitization, link rel, output sandboxing) verified.
- [ ] At least one docs example wires the component to a real AI SDK flow.
- [ ] The `ai-chat` template uses the component in a realistic surface.
- [ ] AI Surfaces domain owner has signed off.

Anything less is `experimental` — visible in docs with the experimental banner, excluded from v1.0 semver guarantees.

---

*This document is versioned with the library. Amendments require review at the level of a positioning change and must be reflected in the roadmap within one minor release.*
