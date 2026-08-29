# Novix UI Examples

Four production-quality starter apps demonstrating real-world Novix UI usage.

| Framework | Path                    | Highlights                                     |
| --------- | ----------------------- | ---------------------------------------------- |
| Next.js   | `examples/next-app`     | App Router, RSC, server actions, dark mode     |
| Vite      | `examples/vite-app`     | SPA, TanStack Router, protected routes         |
| Remix     | `examples/remix-app`    | Loaders/actions, form-heavy admin panel        |
| Astro     | `examples/astro-app`    | Islands architecture, marketing + docs hybrid  |

Each app ships with:

- Themed dashboard shell (sidebar, topbar, command palette)
- Auth screens (login, signup, password reset)
- Data table with filtering, pagination, empty states
- Settings pages with forms, file upload, toasts
- Fully dark-mode compatible via `<ThemeProvider>`

Run any example:

```bash
cd examples/<name>
bun install
bun run dev
```
