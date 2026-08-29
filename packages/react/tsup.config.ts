import { readdirSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

const packageRoot = fileURLToPath(new URL(".", import.meta.url));
const novaRoot = resolve(packageRoot, "../../src/nova");
const uiRoot = join(novaRoot, "ui");

const uiEntries = Object.fromEntries(
  readdirSync(uiRoot)
    .filter((file) => file.endsWith(".tsx") && !file.endsWith(".stories.tsx"))
    .map((file) => [basename(file, extname(file)), join(uiRoot, file)]),
);

const external = [
  "@radix-ui/react-accordion",
  "@radix-ui/react-alert-dialog",
  "@radix-ui/react-aspect-ratio",
  "@radix-ui/react-avatar",
  "@radix-ui/react-checkbox",
  "@radix-ui/react-context-menu",
  "@radix-ui/react-dialog",
  "@radix-ui/react-dropdown-menu",
  "@radix-ui/react-hover-card",
  "@radix-ui/react-label",
  "@radix-ui/react-menubar",
  "@radix-ui/react-navigation-menu",
  "@radix-ui/react-popover",
  "@radix-ui/react-progress",
  "@radix-ui/react-radio-group",
  "@radix-ui/react-scroll-area",
  "@radix-ui/react-select",
  "@radix-ui/react-separator",
  "@radix-ui/react-slider",
  "@radix-ui/react-slot",
  "@radix-ui/react-switch",
  "@radix-ui/react-tabs",
  "@radix-ui/react-tooltip",
  "class-variance-authority",
  "clsx",
  "cmdk",
  "input-otp",
  "lucide-react",
  "motion",
  "motion/react",
  "react",
  "react-dom",
  "react-day-picker",
  "tailwind-merge",
  "tailwindcss",
];

export default defineConfig({
  entry: {
    index: join(novaRoot, "index.ts"),
    tokens: join(novaRoot, "tokens/index.ts"),
    icons: join(novaRoot, "icons/index.tsx"),
    animations: join(novaRoot, "animations/index.ts"),
    ...uiEntries,
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: true,
  minify: false,
  external,
  outDir: "dist",
  onSuccess: "node scripts/copy-styles.mjs",
});
