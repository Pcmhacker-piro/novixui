# Contributing to Novix UI

Thanks for your interest. Novix UI ships premium, accessible components — every contribution is held to that bar.

## Workflow

1. Fork and clone.
2. `bun install`
3. `bun run dev` for the docs site, `bun run test` for the suite, `bun run storybook` for isolated component work.
4. Open a PR targeting `main` with a clear description and screenshots for visual changes.

## Standards

- **TypeScript strict.** No `any` in exported APIs.
- **Tokens only.** No hardcoded colors, spacing, or radii in components.
- **A11y first.** Keyboard nav, focus-visible, ARIA verified. `jest-axe` must pass.
- **Motion opt-out.** Every animation respects `prefers-reduced-motion`.
- **Tests required.** Rendering, variants, states, keyboard, callbacks, a11y.
- **Docs required.** New components need a docs page and a Storybook story.

## Commit messages

Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).

## Releasing

Maintainers only. Uses Changesets → `bun changeset` → merge → CI publishes.
