import { createFileRoute } from "@tanstack/react-router";
import { Button, Card } from "@/nova";
import { RecipePage } from "@/components/docs/recipe-page";

export const Route = createFileRoute("/docs/recipes/modals")({
  component: ModalRecipe,
  head: () => ({
    meta: [
      { title: "Modal workflows recipe · Novix UI" },
      { name: "description", content: "Confirmation and form dialogs with focus trapping and Escape to dismiss." },
    ],
  }),
});

function ModalRecipe() {
  return (
    <RecipePage
      eyebrow="Recipes · Flows"
      title="Modal workflows"
      description="A confirmation dialog with a clear destructive path. Focus is trapped inside the dialog and restored to the trigger on close."
      preview={
        <div className="relative w-full">
          <div className="pointer-events-none flex items-center justify-center rounded-2xl bg-subtle/30 p-8">
            <Card className="pointer-events-auto w-full max-w-sm p-5 shadow-glow">
              <p className="text-base font-semibold">Delete workspace?</p>
              <p className="mt-1 text-sm text-muted-foreground">This action is permanent. All data will be removed within 24 hours.</p>
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="ghost">Cancel</Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </Card>
          </div>
        </div>
      }
      source={`import { Button, Card } from "@novix-ui/react";
import * as Dialog from "@radix-ui/react-dialog";

export function DeleteDialog({ open, onOpenChange }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2">
          <Card className="p-5 shadow-glow">
            <Dialog.Title className="font-semibold">Delete workspace?</Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-muted-foreground">
              This action is permanent.
            </Dialog.Description>
            <div className="mt-5 flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button variant="ghost">Cancel</Button>
              </Dialog.Close>
              <Button variant="destructive">Delete</Button>
            </div>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}`}
      anatomy={[
        "Backdrop uses bg-background/60 + backdrop-blur to keep context visible.",
        "Dialog width capped at ~420px so it never dominates.",
        "Destructive action is right-most; primary path is left (Cancel).",
        "Escape closes; focus returns to the invoking trigger.",
      ]}
      tip={{ variant: "warning", title: "Confirmation is not a substitute for undo", body: "For low-risk actions, offer an undo toast instead of a dialog. Reserve confirmation for irreversible operations." }}
      related={[
        { title: "Toast system", href: "/docs/recipes/toasts" },
        { title: "Card component", href: "/docs/components/card" },
      ]}
    />
  );
}
