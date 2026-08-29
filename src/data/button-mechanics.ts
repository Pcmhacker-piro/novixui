/**
 * Documentation registry for the 25 base 3D button mechanics.
 * Kept separate from render code so docs and gallery stay in lockstep.
 */
export type MechanicCategory =
  | "Lift & Press"
  | "Glow & Halo"
  | "Sweep & Reveal"
  | "Structural"
  | "True 3D"
  | "Loop"
  | "Content Swap"
  | "Metal";

export type Mechanic = {
  key: string;
  name: string;
  category: MechanicCategory;
  summary: string;
  mechanic: string;   // one-line description of the distinct 3D verb
  triggers: ("hover" | "active" | "focus" | "idle-loop")[];
  gpu: "cheap" | "moderate" | "heavy";
  usage: string;      // when to reach for it
  avoid: string;      // when NOT to use it
};

export const MECHANICS: Mechanic[] = [
  { key: "lift",    name: "Solid Lift",       category: "Lift & Press", summary: "Hard stacked-plate shadow lifts on hover, sinks on press.", mechanic: "translateY + hard drop shadow shift", triggers: ["hover", "active"], gpu: "cheap",    usage: "Primary CTAs where tactile weight matters.", avoid: "Dense toolbars — the shadow footprint crowds neighbors." },
  { key: "neon",    name: "Neon Glow",        category: "Glow & Halo",  summary: "Dual inner/outer bloom + text halo.",                    mechanic: "layered box-shadow + text-shadow bloom",   triggers: ["hover", "idle-loop"], gpu: "moderate", usage: "Dark UI accents, sci-fi / gaming.",         avoid: "Long-form content — bloom competes with body text." },
  { key: "glass",   name: "Glass",            category: "Structural",   summary: "Backdrop-blur pane with inset top highlight.",           mechanic: "backdrop-filter + inset highlight",        triggers: ["hover"],           gpu: "heavy",    usage: "Over rich imagery or gradients.",           avoid: "Flat backgrounds — the blur has nothing to sample." },
  { key: "sheen",   name: "Sheen",            category: "Sweep & Reveal", summary: "Diagonal white ribbon sweeps across on hover.",        mechanic: "translateX(0 → 100%) gradient ribbon",     triggers: ["hover"],           gpu: "cheap",    usage: "Premium marketing buttons.",                avoid: "High-frequency interactions — sweep feels ceremonial." },
  { key: "border",  name: "Gradient Border",  category: "Structural",   summary: "Conic-tinted 1.5 px frame around a dark plate.",         mechanic: "1.5px gradient wrap + inner plate",        triggers: ["hover"],           gpu: "cheap",    usage: "Secondary actions that still need identity.", avoid: "Very small sizes — the border overwhelms the label." },
  { key: "press",   name: "Soft Press",       category: "Lift & Press", summary: "Light neumorphic surface; active scale-down.",           mechanic: "inset shadows + active scale(.97)",        triggers: ["active"],          gpu: "cheap",    usage: "Settings, preference toggles.",             avoid: "Dark themes — neumorphism relies on light surfaces." },
  { key: "holo",    name: "Holographic",      category: "Loop",         summary: "Conic-gradient iridescence, slow shift.",                mechanic: "conic-gradient + background-position drift", triggers: ["idle-loop"],     gpu: "moderate", usage: "Hero CTA, launch announcements.",           avoid: "More than one per view — draws all attention." },
  { key: "slide",   name: "Slide Reveal",     category: "Sweep & Reveal", summary: "Skewed color panel slides in, text inverts.",          mechanic: "skewX translate + color swap",             triggers: ["hover"],           gpu: "cheap",    usage: "Editorial / uppercase 'ENTER' style CTAs.",  avoid: "Sentence-case labels — feels stylistically off." },
  { key: "bevel",   name: "Bevel Metal",      category: "Metal",        summary: "Vertical bevel gradient with inset highlight/shadow.",   mechanic: "inset top-highlight + inset bottom-shade", triggers: ["hover"],           gpu: "cheap",    usage: "Game UI, media playback.",                  avoid: "Minimal / editorial products — reads as skeuomorphic." },
  { key: "halo",    name: "Halo Ring",        category: "Glow & Halo",  summary: "Radial blur bloom appears behind on hover.",             mechanic: "outer radial-gradient + blur",             triggers: ["hover"],           gpu: "moderate", usage: "Primary actions on dark surfaces.",          avoid: "Compact grids — glow bleeds into neighbors." },
  { key: "cube",    name: "3D Cube",          category: "True 3D",      summary: "Rotates on X/Y with hard side-shadow.",                  mechanic: "perspective + rotateX/rotateY",            triggers: ["hover"],           gpu: "moderate", usage: "Playful marketing, empty states.",           avoid: "Data-dense dashboards." },
  { key: "iso",     name: "Isometric",        category: "True 3D",      summary: "Persistent tilt with visible right + floor faces.",      mechanic: "static rotateX/Y + 3D face polygons",      triggers: ["hover"],           gpu: "moderate", usage: "Landing heroes, product tours.",             avoid: "Anywhere the tilt breaks a strict grid." },
  { key: "stack",   name: "Layered Stack",    category: "True 3D",      summary: "Two z-stacked panels fan out on hover.",                 mechanic: "translateX/Y on stacked pseudo-layers",    triggers: ["hover"],           gpu: "cheap",    usage: "Card actions ('Open in new').",              avoid: "Icon-only buttons — layers become invisible." },
  { key: "aurora",  name: "Aurora",           category: "Loop",         summary: "Spinning conic blur ring behind inset plate.",           mechanic: "rotating conic gradient + blur",           triggers: ["idle-loop"],       gpu: "heavy",    usage: "AI features, generative CTAs.",              avoid: "Reduced-motion contexts (auto-disabled)." },
  { key: "liquid",  name: "Liquid Fill",      category: "Sweep & Reveal", summary: "Fill height 0 → 100 % rises through the button.",       mechanic: "height transition on inner plate",         triggers: ["hover"],           gpu: "cheap",    usage: "Progress-y CTAs ('Start', 'Fill up').",      avoid: "As a destructive action — feels celebratory." },
  { key: "dots",    name: "Magnet Dots",      category: "Structural",   summary: "Dot-grid background with pulsing indicator.",            mechanic: "radial dot-pattern + scale on dot",        triggers: ["hover"],           gpu: "cheap",    usage: "Technical / dev-tooling actions.",           avoid: "Consumer flows — reads as engineering." },
  { key: "radar",   name: "Radar Ping",       category: "Loop",         summary: "Two staggered expanding ring pulses.",                   mechanic: "box-shadow expanding rings, offset delays", triggers: ["idle-loop"],      gpu: "moderate", usage: "Live status, 'Broadcasting', 'Recording'.",  avoid: "Passive labels — pulse implies action needed." },
  { key: "flip",    name: "Text Flip",        category: "Content Swap", summary: "Two labels translate on Y, marquee-style swap.",         mechanic: "translateY of two stacked labels",         triggers: ["hover"],           gpu: "cheap",    usage: "Download → Go, Buy → Checkout affordances.",  avoid: "When only one message is truthful at a time." },
  { key: "flipcard",name: "Card Flip",        category: "True 3D",      summary: "Full 3D X-rotation revealing a back face.",              mechanic: "rotateX(180°) + backface-visibility",      triggers: ["hover"],           gpu: "moderate", usage: "Preview → Play, front / back detail flips.",  avoid: "Text-heavy back faces — motion sickness risk." },
  { key: "depth",   name: "Depth Panel",      category: "Lift & Press", summary: "Dark inset panel with colored inner light.",             mechanic: "inset colored highlight + drop shadow",    triggers: ["hover"],           gpu: "cheap",    usage: "'Deploy', 'Ship' — infra affordances.",       avoid: "Light themes — inset light gets lost." },
  { key: "brackets",name: "Corner Brackets",  category: "Structural",   summary: "Four L-brackets grow on hover (HUD reticle).",           mechanic: "corner pseudo-elements scale on hover",    triggers: ["hover"],           gpu: "cheap",    usage: "Terminals, technical dashboards.",           avoid: "Marketing / editorial — reads as UI, not brand." },
  { key: "ripple",  name: "Ripple",           category: "Sweep & Reveal", summary: "Center-origin circle scales 0 → 224 px.",              mechanic: "scale-up on centered circle",              triggers: ["hover", "active"], gpu: "cheap",    usage: "Material-flavored surfaces.",                avoid: "Cursor-tracked ripples elsewhere in the same view." },
  { key: "dots3",   name: "Live Dots",        category: "Loop",         summary: "Three staggered bouncing dots (0.15 s offsets).",        mechanic: "translateY bounce with per-dot delay",     triggers: ["idle-loop"],       gpu: "cheap",    usage: "Streaming, live status, typing indicators.",  avoid: "For 'save' actions — implies still working." },
  { key: "ghost",   name: "Punch Ghost",      category: "Structural",   summary: "Dashed outline; interior fill scales & fades in.",       mechanic: "inner fill scale(0.9 → 1) + opacity",      triggers: ["hover"],           gpu: "cheap",    usage: "Tertiary actions, empty-state CTAs.",         avoid: "As the only CTA in a flow — reads as optional." },
  { key: "cmd",     name: "Command Key",      category: "Structural",   summary: "Label + kbd chips with inset highlight.",                mechanic: "border + inset light; kbd caps",           triggers: ["hover"],           gpu: "cheap",    usage: "Search triggers ('Search  ⌘K').",             avoid: "Contexts where the shortcut is not real." },
];
