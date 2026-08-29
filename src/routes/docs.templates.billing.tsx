import { createFileRoute } from "@tanstack/react-router";
import { Badge, Button, Card, Separator } from "@/nova";
import { TemplatePage } from "@/components/docs/template-page";

export const Route = createFileRoute("/docs/templates/billing")({
  component: BillingTemplate,
  head: () => ({ meta: [{ title: "Billing template · Novix UI" }, { name: "description", content: "Plan overview, invoice history, and payment method management." }] }),
});

function BillingTemplate() {
  return (
    <TemplatePage
      eyebrow="Templates · Product"
      title="Billing"
      description="Current plan card, invoice history table, and payment method management — with a clean upgrade path."
      install={`npx @novix-ui/cli template add billing`}
      includes={["Current plan card", "Payment method", "Invoice history", "Usage meter", "Upgrade path"]}
      preview={
        <div className="w-full space-y-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Team plan</p>
                <p className="text-xs text-muted-foreground">$29 / month · renews Aug 12</p>
              </div>
              <Button size="sm" variant="accent">Upgrade</Button>
            </div>
            <Separator className="my-3" />
            <div className="text-xs text-muted-foreground">
              <p>4,120 / 10,000 requests used</p>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-subtle">
                <div className="h-full w-[41%] rounded-full bg-accent" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <p className="text-sm font-semibold">Invoices</p>
            <Separator className="my-3" />
            <div className="space-y-2 text-xs">
              {[
                { m: "July 2026", amt: "$29.00" },
                { m: "June 2026", amt: "$29.00" },
              ].map((i) => (
                <div key={i.m} className="flex items-center justify-between">
                  <span>{i.m}</span>
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    {i.amt} <Badge variant="outline" size="sm">Paid</Badge>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      }
      source={`// src/routes/_app/billing.tsx
export function Billing() {
  const { plan, invoices } = Route.useLoaderData();
  return <BillingLayout plan={plan} invoices={invoices} />;
}`}
    />
  );
}
