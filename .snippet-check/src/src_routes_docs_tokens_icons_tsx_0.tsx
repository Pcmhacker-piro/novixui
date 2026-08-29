import { Icon } from "@novix-ui/icons";
import { Sparkles } from "lucide-react";

export function Demo() {
  return (
    <>
      {/* Decorative (default) — hidden from assistive tech */}
      <Icon icon={Sparkles} size="sm" />
      {/* Meaningful — requires a label */}
      <Icon icon={Sparkles} decorative={false} label="New feature" />
    </>
  );
}