import { Button } from "@novix-ui/react";
import { Sparkles } from "lucide-react";

export function CTA() {
  return (
    <Button leadingIcon={<Sparkles className="size-4" />}>
      Generate
    </Button>
  );
}