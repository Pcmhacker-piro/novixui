/**
 * Nova design tokens (TS mirror of CSS custom properties in styles.css).
 * Use for programmatic access — e.g. inline styles, canvas, charts.
 * The source of truth remains the CSS layer.
 */

export const radii = {
  xs: "0.25rem",
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  full: "9999px",
} as const;

export const fontFamilies = {
  sans: 'Geist, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  display: "Geist, ui-sans-serif, system-ui, sans-serif",
} as const;

/** Fluid type scale — pairs with Tailwind's text-* utilities. */
export const fontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
} as const;

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

/** Semantic color tokens — reference CSS vars, safe for style={{ color: colors.foreground }}. */
export const colors = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  surface: "var(--surface)",
  surfaceElevated: "var(--surface-elevated)",
  subtle: "var(--subtle)",
  muted: "var(--muted)",
  mutedForeground: "var(--muted-foreground)",
  border: "var(--border)",
  borderStrong: "var(--border-strong)",
  ring: "var(--ring)",
  primary: "var(--primary)",
  primaryForeground: "var(--primary-foreground)",
  accent: "var(--accent)",
  accentForeground: "var(--accent-foreground)",
  accentMuted: "var(--accent-muted)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
} as const;

export type NovaToken =
  | keyof typeof radii
  | keyof typeof spacing
  | keyof typeof colors;
