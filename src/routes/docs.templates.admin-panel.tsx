import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card, Separator } from "@/nova";
import { TemplatePage } from "@/components/docs/template-page";

export const Route = createFileRoute("/docs/templates/admin-panel")({
  component: AdminTemplate,
  head: () => ({ meta: [{ title: "Admin panel template · Novix UI" }, { name: "description", content: "Admin scaffold with users, billing, and audit log." }] }),
});

function AdminTemplate() {
  return (
    <TemplatePage
      eyebrow="Templates · Full app"
      title="Admin panel"
      description="A workspace admin surface — user management, billing overview, and audit trail."
      install={`npx @novix-ui/cli template add admin-panel`}
      includes={["Users table", "Roles editor", "Billing overview", "Audit log", "Feature flags"]}
      preview={
        <div className="w-full space-y-3">
          {["Users", "Billing", "Audit log"].map((s) => (
            <Card key={s} className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{s}</p>
                <Badge variant="outline" size="sm">4 events</Badge>
              </div>
              <Separator className="my-3" />
              <p className="text-xs text-muted-foreground">Section body scaffolded and ready for your data.</p>
            </Card>
          ))}
        </div>
      }
      source={`// src/routes/_admin/index.tsx
export function AdminHome() {
  return (
    <AdminShell>
      <UsersSection />
      <BillingSection />
      <AuditLogSection />
    </AdminShell>
  );
}`}
    />
  );
}
