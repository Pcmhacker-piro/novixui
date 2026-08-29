# Changelog

All notable changes follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [SemVer](https://semver.org/).

## [1.0.0] — 2026-07-17

First stable release.

### Added
- 60 production-ready components across layout, forms, overlay, navigation, data, and feedback.
- Token-driven theme system (OKLCH, dark mode, reduced-motion safe).
- Signature motion library: Moon-Edge, Halo Hover, Press Sink, Aperture, Ink Cursor.
- Full documentation site with playground, recipes, templates, migration guides.
- CLI (`@novix-ui/cli`) with `init`, `add`, `remove`, `update`, `diff`, `doctor`, `list`, `search`.
- Storybook coverage for every component with a11y panel and dark-mode preview.
- Example applications for Next.js, Vite, Remix, and Astro.

### Package
- Dual ESM + CJS build via `tsup`.
- `sideEffects: false` for maximum tree-shaking.
- Subpath exports per component; single stylesheet at `@novix-ui/react/styles.css`.

## [0.9.0] — 2026-07-10
- Release candidate. Feature freeze, docs GA, full audit.

## [0.1.0] — 2026-06-01
- Foundation layer: Button, Input, Card, Badge, Separator, Avatar, Skeleton, Spinner, Kbd, Label, IconButton.
