import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, X } from "lucide-react";
import { Button, IconButton } from "@/nova";
import { RecipePage } from "@/components/docs/recipe-page";

export const Route = createFileRoute("/docs/recipes/toasts")({
  component: ToastRecipe,
  head: () => ({
    meta: [
      { title: "Toast system recipe · Novix UI" },
      { name: "description", content: "Non-blocking notifications with stacking, actions, and reduced-motion support." },
    ],
  }),
});

function ToastRecipe() {
  return (
    <RecipePage
      eyebrow="Recipes · Feedback"
      title="Toast system"
      description="Non-blocking notifications that stack, auto-dismiss, and offer an inline action — the confirmation UX that replaces most dialogs."
      preview={
        <div className="w-full max-w-sm space-y-2">
          <div className="nova-card-surface flex items-start gap-3 rounded-xl p-3">
            <CheckCircle2 className="size-5 shrink-0 text-success" />
            <div className="flex-1">
              <p className="text-sm font-medium">Workspace saved</p>
              <p className="text-xs text-muted-foreground">Changes applied to 4 members.</p>
            </div>
            <Button variant="ghost" size="sm">Undo</Button>
            <IconButton aria-label="Dismiss" size="sm"><X /></IconButton>
          </div>
          <div className="nova-card-surface flex items-start gap-3 rounded-xl p-3 opacity-80">
            <CheckCircle2 className="size-5 shrink-0 text-success" />
            <p className="flex-1 text-sm">Invite sent to grace@nova.dev</p>
          </div>
        </div>
      }
      source={`import { Toaster, toast } from "sonner";
import { Button } from "@novix-ui/react";

export function AppRoot({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{ className: "nova-card-surface rounded-xl" }}
      />
    </>
  );
}

// Usage
toast.success("Workspace saved", {
  description: "Changes applied to 4 members.",
  action: { label: "Undo", onClick: revert },
});`}
      anatomy={[
        "Stack at bottom-right on desktop; bottom-center on mobile.",
        "Success toasts auto-dismiss at 4s; errors persist until acknowledged.",
        "Inline Undo action wherever the outcome is reversible.",
        "Respect prefers-reduced-motion — slide gives way to fade.",
      ]}
      tip={{ variant: "best-practice", title: "One live toast per event", body: "Deduplicate by key so rapid actions don't queue five identical notifications." }}
      related={[
        { title: "Modal workflows", href: "/docs/recipes/modals" },
      ]}
    />
  );
}
