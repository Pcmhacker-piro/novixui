import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FileText, Search, Settings } from "lucide-react";
import { Input, Kbd, KbdSequence } from "@/nova";
import { RecipePage } from "@/components/docs/recipe-page";

export const Route = createFileRoute("/docs/recipes/command-palette")({
  component: CommandPaletteRecipe,
  head: () => ({
    meta: [
      { title: "Command palette recipe · Novix UI" },
      { name: "description", content: "A ⌘K launcher with grouped results, keyboard nav, and recents." },
    ],
  }),
});

function CommandPaletteRecipe() {
  return (
    <RecipePage
      eyebrow="Recipes · Product"
      title="Command palette"
      description="A ⌘K launcher — grouped results, keyboard-only navigation, recents. Users should never reach for the mouse."
      preview={
        <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-border/70 bg-background shadow-glow">
          <div className="flex items-center gap-2 border-b border-border/60 px-3">
            <Search className="size-4 text-muted-foreground" />
            <Input placeholder="Search components, guides, actions…" className="border-0 bg-transparent focus-visible:ring-0" />
            <KbdSequence keys={["esc"]} />
          </div>
          <ul className="max-h-72 overflow-auto p-2">
            <li className="px-2 pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Recents</li>
            {["Button", "Card", "Playground"].map((r, i) => (
              <li key={r} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${i === 0 ? "bg-subtle" : ""}`}>
                <span className="inline-flex items-center gap-2"><FileText className="size-4 text-muted-foreground" />{r}</span>
                {i === 0 ? <ArrowRight className="size-4 text-muted-foreground" /> : null}
              </li>
            ))}
            <li className="px-2 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Actions</li>
            <li className="flex items-center justify-between rounded-lg px-3 py-2 text-sm">
              <span className="inline-flex items-center gap-2"><Settings className="size-4 text-muted-foreground" />Open settings</span>
              <Kbd size="sm">,</Kbd>
            </li>
          </ul>
        </div>
      }
      source={`import { Input, Kbd, KbdSequence } from "@novix-ui/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";

export function CommandPalette({ open, onOpenChange, items, actions }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-24 w-[min(92vw,640px)] -translate-x-1/2 rounded-2xl border shadow-glow">
          <Command>
            <Command.Input placeholder="Search…" />
            <Command.List>
              <Command.Group heading="Recents">
                {items.map((r) => <Command.Item key={r.id}>{r.title}</Command.Item>)}
              </Command.Group>
              <Command.Group heading="Actions">
                {actions.map((a) => (
                  <Command.Item key={a.id} onSelect={a.run}>
                    {a.label}
                    <KbdSequence keys={a.shortcut} className="ml-auto" />
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}`}
      anatomy={[
        "Global ⌘K / Ctrl+K opens it from anywhere.",
        "Groups: Recents, Pages, Actions. Each with a mono label header.",
        "Arrow keys move selection; Enter runs the action; Esc closes.",
        "Trailing Kbd shows the shortcut for actions that have one.",
      ]}
      tip={{ variant: "tip", title: "Persist recents in localStorage", body: "The Nova docs ⌘K stores recents by href and de-duplicates. See src/components/docs/command-k.tsx for the pattern." }}
      related={[
        { title: "Kbd component", href: "/docs/components/kbd" },
        { title: "Input component", href: "/docs/components/input" },
      ]}
    />
  );
}
