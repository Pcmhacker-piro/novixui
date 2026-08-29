import type { Transition, Variants } from "motion/react";

/**
 * Nova spring & easing presets. Named for intent, not for physics.
 * Reference these instead of raw numbers so motion stays consistent.
 */
export const springs = {
  snap: { type: "spring", stiffness: 500, damping: 40, mass: 0.6 },
  soft: { type: "spring", stiffness: 220, damping: 26, mass: 1 },
  glide: { type: "spring", stiffness: 140, damping: 22, mass: 1.1 },
} as const satisfies Record<string, Transition>;

export const durations = {
  instant: 0.08,
  fast: 0.15,
  base: 0.22,
  slow: 0.35,
  slower: 0.5,
} as const;

export const easings = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
};

/** Fade + rise — canonical entry variant. */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease: easings.outExpo },
  },
};

/** Staggered container — pair with any child variants. */
export const stagger = (delayChildren = 0, staggerChildren = 0.05): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
});

/** Radix popover/dialog scale-fade. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.fast, ease: easings.outExpo },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: durations.instant, ease: easings.inOut },
  },
};
