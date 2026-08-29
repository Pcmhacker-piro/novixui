/**
 * Nova docs — sidebar navigation.
 * Source of truth for both the sidebar and the ⌘K palette.
 */

export type DocLink = {
  title: string;
  href: string;
  status?: "stable" | "new" | "soon";
  keywords?: string[];
  /** Group in the components gallery. */
  category?: string;
  /** Free-form tags shown in gallery cards. */
  tags?: string[];
};

export type DocSection = {
  label: string;
  eyebrow?: string;
  items: DocLink[];
};

export const DOCS_NAV: DocSection[] = [
  {
    label: "Getting started",
    eyebrow: "Start",
    items: [
      { title: "Introduction", href: "/docs", keywords: ["intro", "overview"] },
      { title: "Installation", href: "/docs/installation", keywords: ["install", "setup"] },
      {
        title: "Quick start",
        href: "/docs/quick-start",
        status: "new",
        keywords: ["tutorial", "first component"],
      },
      {
        title: "Learning paths",
        href: "/docs/learn",
        status: "new",
        keywords: ["guide", "tutorial", "learn"],
      },
      { title: "CLI", href: "/docs/cli", status: "new", keywords: ["command line", "add", "init"] },
      { title: "Theming", href: "/docs/theming", keywords: ["theme", "dark mode"] },
      { title: "Accessibility", href: "/docs/accessibility", keywords: ["a11y", "aria"] },
    ],
  },
  {
    label: "Design tokens",
    eyebrow: "Foundations",
    items: [
      {
        title: "Colors",
        href: "/docs/tokens/colors",
        status: "new",
        keywords: ["palette", "oklch"],
      },
      {
        title: "Typography",
        href: "/docs/tokens/typography",
        status: "new",
        keywords: ["fonts", "type scale"],
      },
      {
        title: "Motion",
        href: "/docs/tokens/motion",
        status: "new",
        keywords: ["easing", "spring", "animation"],
      },
      {
        title: "Motion showcase",
        href: "/docs/motion",
        status: "new",
        keywords: ["motion", "animation", "spring", "showcase"],
      },
      { title: "Spacing", href: "/docs/tokens/spacing", status: "stable" },
      { title: "Icons", href: "/docs/tokens/icons", status: "stable" },
      { title: "Lab", href: "/docs/lab", status: "new", keywords: ["marquee", "ticker", "rating", "snippet", "cursor", "comparison", "announcement", "status"] },
      { title: "Atelier", href: "/docs/atelier", status: "new", keywords: ["switch", "tabs", "tooltip", "slider", "progress", "toast", "timeline", "steps"] },
    ],
  },
  {
    label: "Components",
    eyebrow: "v0.1",
    items: [
      {
        title: "Gallery",
        href: "/docs/components",
        status: "new",
        keywords: ["all", "gallery", "browse", "search"],
      },
      {
        title: "Button",
        href: "/docs/components/button",
        status: "stable",
        category: "Actions",
        tags: ["form", "interactive"],
      },
      {
        title: "3D Button mechanics",
        href: "/docs/components/button-mechanics",
        status: "new",
        category: "Actions",
        tags: ["3d", "gallery", "contributor"],
      },

      {
        title: "Badge",
        href: "/docs/components/badge",
        status: "stable",
        category: "Display",
        tags: ["status", "label"],
      },
      {
        title: "Card",
        href: "/docs/components/card",
        status: "stable",
        category: "Surfaces",
        tags: ["layout", "container"],
      },
      {
        title: "Input",
        href: "/docs/components/input",
        status: "stable",
        category: "Forms",
        tags: ["form", "text"],
      },
      {
        title: "Avatar",
        href: "/docs/components/avatar",
        status: "stable",
        category: "Display",
        tags: ["user"],
      },
      {
        title: "Icon",
        href: "/docs/components/icon",
        status: "stable",
        category: "Display",
        tags: ["svg"],
      },
      {
        title: "IconButton",
        href: "/docs/components/icon-button",
        status: "stable",
        category: "Actions",
        tags: ["interactive"],
      },
      {
        title: "Kbd",
        href: "/docs/components/kbd",
        status: "stable",
        category: "Display",
        tags: ["shortcut"],
      },
      {
        title: "Label",
        href: "/docs/components/label",
        status: "stable",
        category: "Forms",
        tags: ["form"],
      },
      {
        title: "Separator",
        href: "/docs/components/separator",
        status: "stable",
        category: "Layout",
        tags: ["divider"],
      },
      {
        title: "Skeleton",
        href: "/docs/components/skeleton",
        status: "stable",
        category: "Feedback",
        tags: ["loading"],
      },
      {
        title: "Spinner",
        href: "/docs/components/spinner",
        status: "stable",
        category: "Feedback",
        tags: ["loading"],
      },
    ],
  },
  {
    label: "Recipes",
    eyebrow: "Compositions",
    items: [
      { title: "All recipes", href: "/docs/recipes", status: "new", keywords: ["recipes", "compositions"] },
      { title: "Dashboard", href: "/docs/recipes/dashboard", keywords: ["dashboard", "layout"] },
      { title: "Authentication", href: "/docs/recipes/authentication", keywords: ["auth", "login"] },
      { title: "Pricing", href: "/docs/recipes/pricing", keywords: ["pricing", "tiers"] },
      { title: "Empty states", href: "/docs/recipes/empty-states", keywords: ["empty", "zero"] },
      { title: "Settings", href: "/docs/recipes/settings", keywords: ["settings"] },
      { title: "Hero", href: "/docs/recipes/hero", keywords: ["hero", "marketing"] },
      { title: "Docs layout", href: "/docs/recipes/documentation-layout", keywords: ["docs", "layout"] },
      { title: "Data tables", href: "/docs/recipes/data-tables", keywords: ["table", "data"] },
      { title: "Forms", href: "/docs/recipes/forms", keywords: ["form"] },
      { title: "Modals", href: "/docs/recipes/modals", keywords: ["modal", "dialog"] },
      { title: "Command palette", href: "/docs/recipes/command-palette", keywords: ["cmdk", "palette"] },
      { title: "Toasts", href: "/docs/recipes/toasts", keywords: ["toast", "notify"] },
      { title: "Onboarding", href: "/docs/recipes/onboarding", keywords: ["onboarding", "checklist"] },
    ],
  },
  {
    label: "Templates",
    eyebrow: "Ready-made",
    items: [
      { title: "All templates", href: "/docs/templates", status: "new", keywords: ["templates"] },
      { title: "SaaS dashboard", href: "/docs/templates/saas-dashboard", keywords: ["saas", "dashboard"] },
      { title: "Landing page", href: "/docs/templates/landing-page", keywords: ["landing", "marketing"] },
      { title: "Admin panel", href: "/docs/templates/admin-panel", keywords: ["admin"] },
      { title: "Documentation site", href: "/docs/templates/documentation-site", keywords: ["docs"] },
      { title: "Portfolio", href: "/docs/templates/portfolio", keywords: ["portfolio"] },
      { title: "Blog", href: "/docs/templates/blog", keywords: ["blog"] },
      { title: "Login", href: "/docs/templates/login", keywords: ["login"] },
      { title: "Signup", href: "/docs/templates/signup", keywords: ["signup"] },
      { title: "Settings", href: "/docs/templates/settings", keywords: ["settings"] },
      { title: "Profile", href: "/docs/templates/profile", keywords: ["profile"] },
      { title: "Billing", href: "/docs/templates/billing", keywords: ["billing"] },
      { title: "Team management", href: "/docs/templates/team-management", keywords: ["team"] },
    ],
  },
  {
    label: "Migration",
    eyebrow: "Coming from",
    items: [
      { title: "Overview", href: "/docs/migration", status: "new", keywords: ["migration"] },
      { title: "From Tailwind UI", href: "/docs/migration/tailwind-ui", keywords: ["tailwind"] },
      { title: "From Chakra UI", href: "/docs/migration/chakra-ui", keywords: ["chakra"] },
      { title: "From Material UI", href: "/docs/migration/material-ui", keywords: ["mui", "material"] },
      { title: "From Ant Design", href: "/docs/migration/ant-design", keywords: ["ant", "antd"] },
      { title: "From Bootstrap", href: "/docs/migration/bootstrap", keywords: ["bootstrap"] },
    ],
  },
  {
    label: "Explore",
    eyebrow: "More",
    items: [
      { title: "Playground", href: "/docs/playground", status: "new", keywords: ["sandbox", "try"] },
      { title: "Effects", href: "/docs/effects", status: "new", keywords: ["spotlight", "aurora", "meteors", "beams", "tilt", "bento", "wavy", "aceternity", "animated background"] },
      { title: "Guides", href: "/docs/guides", status: "new", keywords: ["guides", "tutorials", "walkthroughs", "how-to"] },
      { title: "Showcase", href: "/docs/showcase", status: "new", keywords: ["gallery", "built with", "examples", "sites"] },
      { title: "Design principles", href: "/docs/design-principles", status: "new", keywords: ["principles"] },
      { title: "Troubleshooting", href: "/docs/troubleshooting", status: "new", keywords: ["issues", "help"] },
      { title: "Roadmap", href: "/docs/roadmap", keywords: ["releases", "future"] },
      { title: "Changelog", href: "/docs/changelog", keywords: ["releases", "history"] },
      { title: "FAQ", href: "/docs/faq", keywords: ["questions"] },
    ],
  },
];

export const FLAT_DOCS: DocLink[] = DOCS_NAV.flatMap((s) => s.items);
