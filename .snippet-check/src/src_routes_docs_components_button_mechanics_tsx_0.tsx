import { getVariant, variantToCssVars } from "@/data/button-variants";

const v = getVariant(item.id, item.styleKey, item.hue);
<div style={{ perspective: "var(--nova-perspective)", ...variantToCssVars(v) }}>
  {/* ...tile that reads var(--nova-rotx), var(--nova-ease), etc. */}
</div>