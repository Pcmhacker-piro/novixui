import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogIn,
  Settings2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { DocsShell, DocLead } from "@/components/docs/docs-shell";
import { HubGrid, type HubEntry } from "@/components/docs/hub-grid";

export const Route = createFileRoute("/docs/templates/")({
  component: TemplatesIndex,
  head: () => ({
    meta: [
      { title: "Templates · Novix UI" },
      { name: "description", content: "Copy-paste page templates — dashboards, landing pages, admin panels, and more." },
      { property: "og:title", content: "Templates · Novix UI" },
      { property: "og:description", content: "Ready-to-use page templates for common product surfaces." },
    ],
  }),
});

const TEMPLATES: HubEntry[] = [
  { title: "SaaS Dashboard", href: "/docs/templates/saas-dashboard", description: "Sidebar, KPI header, activity feed, and a data table.", icon: <LayoutDashboard className="size-5" />, eyebrow: "Full app" },
  { title: "Landing page", href: "/docs/templates/landing-page", description: "Hero, feature grid, testimonial rail, and CTA footer.", icon: <FileText className="size-5" />, eyebrow: "Marketing" },
  { title: "Admin panel", href: "/docs/templates/admin-panel", description: "Multi-section admin with users, billing, and audit log.", icon: <Building2 className="size-5" />, eyebrow: "Full app" },
  { title: "Documentation site", href: "/docs/templates/documentation-site", description: "The three-column shell used by these docs.", icon: <BookOpen className="size-5" />, eyebrow: "Content" },
  { title: "Portfolio", href: "/docs/templates/portfolio", description: "A single-page portfolio with case studies.", icon: <Briefcase className="size-5" />, eyebrow: "Personal" },
  { title: "Blog", href: "/docs/templates/blog", description: "A minimal blog with reading time and mono callouts.", icon: <BookOpen className="size-5" />, eyebrow: "Content" },
  { title: "Login", href: "/docs/templates/login", description: "Centered login with OAuth and email/password.", icon: <LogIn className="size-5" />, eyebrow: "Auth" },
  { title: "Signup", href: "/docs/templates/signup", description: "Signup with plan selection and password strength.", icon: <UserPlus className="size-5" />, eyebrow: "Auth" },
  { title: "Settings", href: "/docs/templates/settings", description: "Sectioned settings with sticky nav and danger zone.", icon: <Settings2 className="size-5" />, eyebrow: "Product" },
  { title: "Profile", href: "/docs/templates/profile", description: "Public profile with cover, avatar, and pinned work.", icon: <User className="size-5" />, eyebrow: "Product" },
  { title: "Billing", href: "/docs/templates/billing", description: "Plans, invoices, and payment method management.", icon: <CreditCard className="size-5" />, eyebrow: "Product" },
  { title: "Team management", href: "/docs/templates/team-management", description: "Members table, invites, and role management.", icon: <Users className="size-5" />, eyebrow: "Product" },
];

function TemplatesIndex() {
  return (
    <DocsShell
      eyebrow="Templates"
      title="Templates"
      description="Twelve ready-to-use page templates. Copy the source, wire the routes, ship."
    >
      <DocLead>
        Each template is a full route file. Drop it into <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">src/routes/</code> and you have a working page.
      </DocLead>
      <HubGrid entries={TEMPLATES} columns={3} />
    </DocsShell>
  );
}
