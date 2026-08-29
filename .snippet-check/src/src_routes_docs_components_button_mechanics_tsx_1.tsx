// src/data/button-variants.ts
export function getVariant(id: string, styleKey: string, hueKey: string): Variant;
export function variantToCssVars(v: Variant): React.CSSProperties;

// Emits: --nova-perspective, --nova-rotx, --nova-roty, --nova-z,
//        --nova-scale, --nova-press-z, --nova-duration, --nova-ease,
//        --nova-origin, --nova-halo-mix, --nova-halo-blur,
//        --nova-shadow-spread, --nova-shadow-y, --nova-lift-y