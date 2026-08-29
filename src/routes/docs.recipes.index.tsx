import { createFileRoute } from "@tanstack/react-router";
import {
  Command,
  CreditCard,
  FileText,
  Inbox,
  LayoutDashboard,
  LogIn,
  Mail,
  MessageSquare,
  Rocket,
  Settings2,
  Sparkles,
  Table,
} from "lucide-react";
import { DocsShell, DocLead } from "@/components/docs/docs-shell";
import { HubGrid, type HubEntry } from "@/components/docs/hub-grid";

export const Route = createFileRoute("/docs/recipes/")({
  component: RecipesIndex,
  head: () => ({
    meta: [
      { title: "Recipes · Novix UI" },
      { name: "description", content: "Copy-paste recipes that compose Nova primitives into complete product patterns." },
      { property: "og:title", content: "Recipes · Novix UI" },
      { property: "og:description", content: "Real-world product patterns built from Nova primitives." },
    ],
  }),
});

const RECIPES: HubEntry[] = [
  { title: "Dashboard", href: "/docs/recipes/dashboard", description: "A sidebar layout with KPI cards, activity feed, and a data table.", icon: <LayoutDashboard className="size-5" />, eyebrow: "Layout" },
  { title: "Authentication screens", href: "/docs/recipes/authentication", description: "Sign in, sign up, and password reset flows with keyboard-first forms.", icon: <LogIn className="size-5" />, eyebrow: "Flows" },
  { title: "Pricing page", href: "/docs/recipes/pricing", description: "A tier grid with an emphasized plan, feature matrix, and FAQs.", icon: <CreditCard className="size-5" />, eyebrow: "Marketing" },
  { title: "Settings page", href: "/docs/recipes/settings", description: "Sectioned settings with sticky nav, form groupings, and destructive zones.", icon: <Settings2 className="size-5" />, eyebrow: "Product" },
  { title: "Marketing hero", href: "/docs/recipes/hero", description: "A landing hero with eyebrow, headline, sub, and dual CTAs.", icon: <Rocket className="size-5" />, eyebrow: "Marketing" },
  { title: "Documentation layout", href: "/docs/recipes/documentation-layout", description: "The three-column shell — sidebar, article, TOC — used by these docs.", icon: <FileText className="size-5" />, eyebrow: "Layout" },
  { title: "Data tables", href: "/docs/recipes/data-tables", description: "Sortable, filterable rows with skeleton loading and empty states.", icon: <Table className="size-5" />, eyebrow: "Product" },
  { title: "Empty states", href: "/docs/recipes/empty-states", description: "First-run and zero-data screens that feel confident, not incomplete.", icon: <Inbox className="size-5" />, eyebrow: "UX" },
  { title: "Forms", href: "/docs/recipes/forms", description: "Grouped inputs, inline validation, and destructive confirmations.", icon: <FileText className="size-5" />, eyebrow: "Product" },
  { title: "Modal workflows", href: "/docs/recipes/modals", description: "Focus-trapped dialogs with confirmation, forms, and lightbox variants.", icon: <MessageSquare className="size-5" />, eyebrow: "Flows" },
  { title: "Command palette", href: "/docs/recipes/command-palette", description: "A ⌘K launcher with search, recents, and keyboard-only navigation.", icon: <Command className="size-5" />, eyebrow: "Product" },
  { title: "Toast system", href: "/docs/recipes/toasts", description: "Non-blocking notifications with stacking, actions, and reduced-motion mode.", icon: <Sparkles className="size-5" />, eyebrow: "Feedback" },
  { title: "Onboarding flow", href: "/docs/recipes/onboarding", description: "A multi-step flow with progress, skip-safe navigation, and celebratory end.", icon: <Mail className="size-5" />, eyebrow: "Flows" },
];

function RecipesIndex() {
  return (
    <DocsShell
      eyebrow="Recipes"
      title="Recipes"
      description="Real product patterns composed from Nova primitives. Copy the source, wire it into your app, adjust the tokens."
    >
      <DocLead>
        Every recipe is a plain <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">.tsx</code> file. No hidden magic, no framework couplings. Read them like a cookbook, not a black box.
      </DocLead>
      <HubGrid entries={RECIPES} columns={3} />
    </DocsShell>
  );
}
