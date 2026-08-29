# Novix UI — CLI Roadmap

Status: Planned · First surface in v0.3 · Full surface by v1.0 · Owner: DX

The Nova CLI is not a scaffolding gimmick. It is the primary interface between
a developer's repo and the Novix UI system — the thing they run every week, not
just on day one. It must feel like `gh`, `stripe`, and `vercel`: fast, quiet,
scriptable, and safe by default.

This document defines the command surface, shared conventions, and the release
that owns each command. Implementation follows this spec; deviations require
an update here first.

---

## 1. Principles

1. **Idempotent.** Every command is safe to run twice. Re-runs are no-ops or
   explicit updates, never surprises.
2. **Explicit writes.** Nothing is written without a diff preview unless
   `--yes` is passed. `--dry-run` is universal.
3. **Deterministic.** Same inputs, same repo state → same output bytes.
4. **Machine-readable.** Every command supports `--json`. Human output is a
   view over the same data.
5. **Local-first.** No account required. No telemetry without opt-in.
   Everything runs offline once the registry is cached.
6. **Composable.** Commands pipe cleanly (`nova diff --json | jq …`) and exit
   with meaningful codes (`0` ok, `1` user error, `2` drift, `3` network).
7. **Framework-aware, framework-agnostic.** Detects Next, Remix, TanStack
   Start, Vite, Astro; adapts imports and paths accordingly. Never assumes.

---

## 2. Global Conventions

Applies to **every** command.

| Flag | Effect |
|---|---|
| `--cwd <path>` | Run as if from `<path>`. Default: process cwd. |
| `--config <file>` | Override `nova.config.json` location. |
| `--json` | Emit structured JSON to stdout; logs to stderr. |
| `--dry-run` | Compute changes, print diff, write nothing. |
| `--yes`, `-y` | Skip confirmation prompts. |
| `--no-color` | Disable ANSI. Also honors `NO_COLOR`. |
| `--verbose`, `-v` / `--quiet`, `-q` | Log level. Repeatable. |
| `--registry <url>` | Override component registry endpoint. |
| `--offline` | Fail rather than hit the network. |

Shared behaviors:
- Reads `nova.config.json` at repo root (or nearest ancestor).
- Writes are staged in memory, previewed as a unified diff, then flushed.
- Prompts use non-blocking defaults so CI never hangs.
- Every command prints a one-line summary on success (`✓ added Button (3 files, 1 dep)`).
- Exit code table is stable and documented in `--help`.

Config shape:
```json
{
  "$schema": "https://novix-ui.dev/schema/config.json",
  "framework": "tanstack-start",
  "tsx": true,
  "aliases": { "components": "@/components/nova", "utils": "@/lib/utils" },
  "tailwind": { "css": "src/styles.css" },
  "theme": "nova.theme.json",
  "registry": "https://registry.novix-ui.dev"
}
```

---

## 3. Command Surface

### 3.1 `nova init` — bootstrap a project *(v0.3)*
Sets up Novix UI in an existing app. Non-destructive; refuses to overwrite
without `--force`.

- Detects framework, TS/JS, package manager, Tailwind version and entry file.
- Writes `nova.config.json`, injects required tokens into the Tailwind entry
  (guarded by comment markers so re-runs are safe), installs runtime deps
  (`motion`, `@radix-ui/react-*` as needed, `clsx`, `tailwind-merge`).
- Creates `components/nova/` and `lib/utils.ts` if missing.
- Registers path aliases in `tsconfig.json` / framework config when absent.

Flags: `--framework`, `--ts|--js`, `--pm <npm|pnpm|yarn|bun>`, `--tailwind-entry <path>`, `--yes`, `--force`.

Success artifact: `nova.config.json` + a printed "next steps" list including
`nova add button`.

### 3.2 `nova add <component…>` — install components *(v0.3)*
Copies component source (and its dependencies) from the registry into the
repo under the configured alias. Source ships to the repo — no runtime magic.

- Resolves transitive component and package dependencies.
- Rewrites imports to match the local alias.
- Refuses to overwrite modified files unless `--force`; otherwise prints a
  three-way diff and asks.
- Records installed components and versions in `nova.config.json` under
  `components` for future `update` / `diff` / `upgrade`.

Flags: `--all`, `--overwrite`, `--path <dir>`, `--no-deps`, `--registry`, `--dry-run`, `--yes`.

Examples:
```
nova add button input card
nova add --all --dry-run
```

### 3.3 `nova update` — sync installed components *(v0.4)*
Pulls the latest **compatible** version of every installed component (respects
the pinned major from `nova.config.json`), shows a per-file diff, and applies
only what the user accepts. Preserves local edits via 3-way merge; conflicts
are written with standard `<<<<<<<` markers and listed in the summary.

Flags: `--only <names>`, `--interactive` (default), `--all`, `--strategy <ours|theirs|merge>`, `--dry-run`.

### 3.4 `nova doctor` — diagnose the install *(v0.4)*
Read-only health check. Never writes.

Checks include:
- Framework, Node, package manager versions in supported range.
- Tailwind v4 detected; `@import "tailwindcss"` present; no legacy `@tailwind`
  directives; no stray `tailwind.config.js`.
- Required tokens present in the Tailwind entry (`--color-*`, `--radius-*`, `--motion-*`).
- Path aliases resolve; `components/nova/` exists; `lib/utils.ts` exports `cn`.
- Peer deps installed and version-compatible.
- Duplicate `motion` / `react` versions in the graph.
- Theme file loads and passes the same validator as the Theme Generator
  (contrast, gamut, reduced-motion output).

Exits `0` on all-green, `2` on drift/warnings, `1` on errors. `--fix`
performs the subset of remediations that are unambiguous (missing tokens,
missing aliases) and asks before anything else.

### 3.5 `nova theme` — theme workflows *(v0.6)*
Wraps the Theme Generator engine (see `THEME_GENERATOR.md`).

Subcommands:
- `nova theme new [--from <preset>] [--seed <color>]` — interactive TTY editor;
  emits `nova.theme.json`.
- `nova theme edit` — reopen the last theme in the interactive editor.
- `nova theme export [--format css|tailwind|json|all] [--out <dir>]` — write
  deterministic exports from `nova.theme.json`.
- `nova theme apply` — write the CSS export into the project's Tailwind entry
  (between guarded markers) and update `nova.config.json.theme`.
- `nova theme validate` — run the theme validator; exit non-zero on errors.
- `nova theme open` — open the web generator in the browser, preloaded with
  the local theme via URL state.

### 3.6 `nova upgrade` — bump the Nova major *(v0.7)*
Distinct from `update`: `upgrade` moves the project across a **major** Nova
release, running codemods and rewriting `nova.config.json`.

- Resolves an upgrade path (`0.5 → 0.6 → 0.7`) and runs each step in order.
- Each codemod is a pure AST transform with a preview and a rollback plan.
- Regenerates any tokens whose names or shapes changed.
- Prints a migration report with links to release notes and a list of
  manual follow-ups.

Flags: `--to <version>` (default: latest), `--from <version>` (default: detected), `--dry-run`, `--yes`, `--skip <codemod>`.

### 3.7 `nova diff` — compare local vs registry *(v0.5)*
Prints a per-component report of drift:
- Files unchanged.
- Files locally modified (with hunk-level diff on request).
- Files upstream-updated since install.
- Files that would 3-way merge cleanly vs. conflict.

Modes:
- Default: human table.
- `--json`: structured drift report suitable for CI gates.
- `--component <name>`: focus one component.
- `--since <version>`: compare against a specific past release.

Exit `0` clean, `2` drift present. Intended to run in CI to prevent silent
divergence from the design system.

### 3.8 `nova generate <kind>` — scaffolds *(v0.8)*
Generates first-party artifacts from templates. Templates live in the registry
and are versioned like components.

Kinds:
- `component <Name>` — a Nova-compliant component skeleton wired to
  `COMPONENT_SPECIFICATION.md` (variants, sizes, states, tests, docs page,
  Storybook/Ladle story).
- `page <route>` — framework-appropriate route file with Nova layout.
- `story <Component>` — story file only.
- `test <Component>` — test file only.
- `icon <Name>` — SVG → typed icon component with tree-shake-safe export.
- `docs <Component>` — MDX page matching `DOCUMENTATION_STANDARDS.md`.
- `ai-block <kind>` — AI-native building blocks (chat, prompt input, tool
  call, citation) per `AI_POSITIONING.md`.

Flags: `--dir <path>`, `--dry-run`, `--force`. All output passes `nova lint`
before being written.

### 3.9 `nova lint` — enforce the design system *(v0.9)*
Static analysis that catches design-system violations code review misses.
Runs as a CLI and as an ESLint plugin (`eslint-plugin-nova`) sharing rules.

Rule categories (each ruleset is opt-out via config):
- **tokens** — forbid hard-coded colors, radii, shadows, durations in
  components; require semantic tokens.
- **api** — components must expose the shared prop vocabulary
  (`API_PHILOSOPHY.md`); forbid re-invented names (`type` for variant, etc.).
- **a11y** — missing `aria-*`, focus-visible, keyboard handlers on custom
  interactives, dialogs without labels.
- **motion** — animations must use motion tokens; must respect
  `prefers-reduced-motion`.
- **imports** — no deep imports into `components/nova/*/internal`; no cross-
  component internal imports.
- **spec** — every component in `components/nova/` has variants, sizes,
  tests, docs, and a `data-slot`/`data-state` contract.

Modes: `--fix` (safe auto-fixes only), `--staged` (only files staged in git),
`--format <pretty|json|sarif>`. Exit `1` on any error.

---

## 4. Delivery Timeline

| Release | Ships |
|---|---|
| **v0.3** | `init`, `add` |
| **v0.4** | `update`, `doctor` |
| **v0.5** | `diff` |
| **v0.6** | `theme` (all subcommands) |
| **v0.7** | `upgrade` + codemod runtime |
| **v0.8** | `generate` (all kinds), template registry |
| **v0.9** | `lint` (CLI + ESLint plugin) |
| **v1.0** | Stable command surface, shell completions (bash/zsh/fish/pwsh), plugin API, `nova plugin` for third-party subcommands, published man pages, homebrew/scoop/npm distribution |

Each release ships CLI docs, `--help` parity, and an integration test that
runs the full command against a fresh fixture app per supported framework.

---

## 5. Architecture

- **Language:** TypeScript, compiled to a single ESM bundle per Node target.
- **Runtime:** Node ≥20; Bun and Deno supported via the same entry.
- **Distribution:** `@novix-ui/cli` on npm; `nova` binary; standalone
  binaries via `pkg`/`bun build --compile` for CI images that lack Node.
- **Rendering:** Ink for interactive TTY (theme editor, prompts). Plain
  streams when `stdout` is not a TTY or `--json` is set.
- **Registry:** static JSON manifests + component source over HTTPS with
  content-addressed hashes; fully cacheable, no server-side rendering.
- **Codemods:** built on `jscodeshift` + `ts-morph`; every codemod is
  unit-tested against golden fixtures.
- **Plugins (v1.0):** `nova.config.json.plugins: string[]` loads
  `@scope/nova-plugin-*` packages that register subcommands via a typed API.

---

## 6. Non-Goals

- No component-level runtime bundling. `nova add` copies source; the app
  bundler owns the rest.
- No account, no telemetry-by-default, no remote config that changes
  behavior without a code change.
- No lock-in file formats. `nova.config.json` and `nova.theme.json` are the
  only Nova-owned files, both human-readable and hand-editable.

---

## 7. Definition of Done (per command)

Before a command is marked stable it must have:
1. `--help` covering every flag with examples.
2. `--json` output with a documented schema.
3. `--dry-run` producing the same plan a real run would execute.
4. Integration tests against every supported framework fixture.
5. A docs page under `/docs/cli/<command>` following
   `DOCUMENTATION_STANDARDS.md`.
6. A row in `nova doctor`'s checks for anything the command guarantees.
