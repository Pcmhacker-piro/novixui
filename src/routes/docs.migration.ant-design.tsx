import { createFileRoute } from "@tanstack/react-router";
import { MigrationPage } from "@/components/docs/migration-page";

export const Route = createFileRoute("/docs/migration/ant-design")({
  component: AntMigration,
  head: () => ({ meta: [{ title: "Migrate from Ant Design · Novix UI" }, { name: "description", content: "Move from Ant Design's dense enterprise components to Nova." }] }),
});

function AntMigration() {
  return (
    <MigrationPage
      eyebrow="Migration"
      title="From Ant Design"
      description="Ant Design is dense and comprehensive — great for internal tools, heavy for product surfaces. Nova gives you fewer components with cleaner defaults."
      overview="Expect a smaller surface. Nova won't ship every enterprise widget Ant does; the ones we do ship are more opinionated and less configurable."
      install={`bun add @novix-ui/react\n# incremental: keep antd installed during migration`}
      mapping={[
        { from: "Button", to: "Button", notes: "primary/default/dashed/link → primary/secondary/outline/link." },
        { from: "Space", to: "Tailwind gap-*", notes: "Use flex/grid + gap utilities." },
        { from: "Card", to: "Card", notes: "Cleaner header/footer composition." },
        { from: "Input", to: "Input + Label", notes: "Icon slots via leadingIcon/trailingIcon." },
        { from: "message / notification", to: "Toast recipe", notes: "Use sonner + Nova styles." },
      ]}
      diffBefore={`<Button type="primary" icon={<SearchOutlined />}>
  Search
</Button>`}
      diffAfter={`import { Button } from "@novix-ui/react";
import { Search } from "lucide-react";

<Button leadingIcon={<Search />}>Search</Button>`}
      traps={[
        "Ant's ConfigProvider provides global config; Nova relies on CSS tokens instead. Delete the provider once fully migrated.",
        "Ant Table has a huge surface. Nova ships a Data Tables recipe — pick the columns you actually need before rewriting.",
        "Ant's default font-size is 14px; Nova is 15–16px in most surfaces. Expect a subtle typography shift.",
      ]}
    />
  );
}
