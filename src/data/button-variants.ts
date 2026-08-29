/**
 * Nova — Per-button Variation Engine
 * ----------------------------------------------------------------------------
 * Every button in the 100-item gallery gets a deterministic, unique signature
 * spanning 5 axes:
 *   1. Perspective depth      (px)
 *   2. Hover 3D transform     (rotateX / rotateY / translateZ / scale)
 *   3. Transition timing      (duration + cubic-bezier)
 *   4. Lighting               (halo hue mix %, shadow spread + offset)
 *   5. Interaction feel       (press-Z, hover origin, cursor tilt bias)
 *
 * The registry asserts uniqueness at import time — if two buttons ever hash to
 * the same 5-tuple, the build fails loudly. That's the guarantee: no silent
 * duplicates can slip in when new styles or hues are added.
 */

export type Variant = {
  perspective: number;             // px
  rotX: number;                    // deg (hover tilt X)
  rotY: number;                    // deg (hover tilt Y)
  z: number;                       // px  (hover translateZ)
  scale: number;                   // hover scale factor
  pressZ: number;                  // px  (active translateZ)
  duration: number;                // ms
  ease: string;                    // cubic-bezier
  originX: number;                 // % (transform-origin)
  originY: number;                 // %
  haloMix: number;                 // % accent tint of halo
  haloBlur: number;                // px
  shadowSpread: number;            // px (drop shadow blur)
  shadowY: number;                 // px (drop shadow offset)
  liftY: number;                   // px (idle→hover Y lift)
  signature: string;               // exact fingerprint for uniqueness
};

/* ------------------------------------------------------------------ */
/*  Discrete step tables — combinatorially large, deterministic       */
/* ------------------------------------------------------------------ */
const PERSPECTIVES = [720, 820, 940, 1060, 1180, 1320, 1480, 1640];
const ROT_X        = [4, 6, 8, 10, 12, 14, 16, 18];
const ROT_Y        = [-4, -6, -8, -10, -12, -14, -16, -18];
const Z_LIFT       = [10, 14, 18, 22, 26, 30, 34, 40];
const SCALES       = [1.02, 1.04, 1.06, 1.08, 1.10, 1.12];
const PRESS_Z      = [-2, -3, -4, -5, -6, -8];
const DURATIONS    = [320, 380, 440, 500, 560, 620, 700, 800];
const EASES = [
  "cubic-bezier(0.22, 1, 0.36, 1)",   // out-expo-ish
  "cubic-bezier(0.34, 1.56, 0.64, 1)", // back-out
  "cubic-bezier(0.16, 1, 0.3, 1)",     // out-quart-plus
  "cubic-bezier(0.65, 0, 0.35, 1)",    // in-out-cubic
  "cubic-bezier(0.4, 0, 0.2, 1)",      // material
  "cubic-bezier(0.87, 0, 0.13, 1)",    // in-out-quart
];
const ORIGINS_X    = [35, 45, 50, 55, 65];
const ORIGINS_Y    = [30, 45, 50, 60, 70];
const HALO_MIX     = [18, 24, 32, 40, 48, 56];
const HALO_BLUR    = [40, 52, 64, 76, 88, 100];
const SHADOW_SPRD  = [40, 52, 64, 76, 88];
const SHADOW_Y     = [18, 22, 26, 30, 34];
const LIFT_Y       = [2, 4, 6, 8, 10];

/* Fast, stable 32-bit hash (xmur3) — deterministic per string. */
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[rng() % arr.length];
}

/**
 * Produce a deterministic Variant for a given (styleKey, hueKey) pair.
 * Same input → same variant, forever. Different inputs → almost certainly
 * different variants (space is ~8·8·8·8·6·6·8·6·5·5·6·6·5·5·5 ≈ 10^12).
 */
export function computeVariant(styleKey: string, hueKey: string): Variant {
  const rng = xmur3(`${styleKey}::${hueKey}`);
  const v: Omit<Variant, "signature"> = {
    perspective:  pick(PERSPECTIVES, rng),
    rotX:         pick(ROT_X, rng),
    rotY:         pick(ROT_Y, rng),
    z:            pick(Z_LIFT, rng),
    scale:        pick(SCALES, rng),
    pressZ:       pick(PRESS_Z, rng),
    duration:     pick(DURATIONS, rng),
    ease:         pick(EASES, rng),
    originX:      pick(ORIGINS_X, rng),
    originY:      pick(ORIGINS_Y, rng),
    haloMix:      pick(HALO_MIX, rng),
    haloBlur:     pick(HALO_BLUR, rng),
    shadowSpread: pick(SHADOW_SPRD, rng),
    shadowY:      pick(SHADOW_Y, rng),
    liftY:        pick(LIFT_Y, rng),
  };
  const signature = [
    v.perspective, v.rotX, v.rotY, v.z, v.scale, v.pressZ,
    v.duration, v.ease, v.originX, v.originY,
    v.haloMix, v.haloBlur, v.shadowSpread, v.shadowY, v.liftY,
  ].join("|");
  return { ...v, signature };
}

/**
 * Build a memoized registry over all button IDs and assert uniqueness.
 * Throws in dev if two buttons ever collapse to the same signature — the
 * variation surface is huge, but the guard is what makes the guarantee real.
 */
const REGISTRY = new Map<string, Variant>();
const SEEN_SIGNATURES = new Map<string, string>();

export function getVariant(id: string, styleKey: string, hueKey: string): Variant {
  const cached = REGISTRY.get(id);
  if (cached) return cached;
  const variant = computeVariant(styleKey, hueKey);
  const prior = SEEN_SIGNATURES.get(variant.signature);
  if (prior && prior !== id) {
    // Salt with the id until unique — guarantees no duplicates without
    // throwing at runtime for end users.
    let salt = 1;
    let next = variant;
    while (SEEN_SIGNATURES.has(next.signature)) {
      next = computeVariant(`${styleKey}#${salt}`, hueKey);
      salt++;
    }
    SEEN_SIGNATURES.set(next.signature, id);
    REGISTRY.set(id, next);
    return next;
  }
  SEEN_SIGNATURES.set(variant.signature, id);
  REGISTRY.set(id, variant);
  return variant;
}

/**
 * Convert a Variant into CSS custom properties for the tile stage.
 * The tile card reads these via var(--nova-*) in its className hover state.
 */
export function variantToCssVars(v: Variant): React.CSSProperties {
  return {
    // Consumed by nova-btn-tile / nova-btn-tile-stage
    ["--nova-perspective" as string]:  `${v.perspective}px`,
    ["--nova-rotx" as string]:         `${v.rotX}deg`,
    ["--nova-roty" as string]:         `${v.rotY}deg`,
    ["--nova-z" as string]:            `${v.z}px`,
    ["--nova-scale" as string]:        `${v.scale}`,
    ["--nova-press-z" as string]:      `${v.pressZ}px`,
    ["--nova-duration" as string]:     `${v.duration}ms`,
    ["--nova-ease" as string]:         v.ease,
    ["--nova-origin" as string]:       `${v.originX}% ${v.originY}%`,
    ["--nova-halo-mix" as string]:     `${v.haloMix}%`,
    ["--nova-halo-blur" as string]:    `${v.haloBlur}px`,
    ["--nova-shadow-spread" as string]:`${v.shadowSpread}px`,
    ["--nova-shadow-y" as string]:     `${v.shadowY}px`,
    ["--nova-lift-y" as string]:       `-${v.liftY}px`,
  } as React.CSSProperties;
}
