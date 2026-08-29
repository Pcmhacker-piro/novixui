// @ts-nocheck — Vitest suite; typechecked by the test runner, not the app build.
/**
 * Structural regression tests for the 100-button gallery.
 *
 * These are the *cheap* half of the anti-duplication guarantee — they run in
 * milliseconds on every CI push and catch the class of duplication that the
 * variation engine is supposed to prevent (identical physics across two
 * mechanics, missing mechanic docs, hue-siblings that are just recolors).
 *
 * The *pixel* half lives in `tests/visual/buttons-visual.mjs` (Playwright).
 */
import { describe, it, expect } from "vitest";
import { BUTTONS } from "@/data/buttons";
import { MECHANICS } from "@/data/button-mechanics";
import { computeVariant, getVariant } from "@/data/button-variants";

describe("100-button gallery — structural uniqueness", () => {
  it("ships exactly 100 buttons", () => {
    expect(BUTTONS.length).toBe(100);
  });

  it("every button id is unique", () => {
    const ids = BUTTONS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every styleKey used in the gallery has a Mechanic entry", () => {
    const documented = new Set(MECHANICS.map((m) => m.key));
    const undocumented = [...new Set(BUTTONS.map((b) => b.styleKey))].filter(
      (k) => !documented.has(k),
    );
    expect(undocumented).toEqual([]);
  });

  it("every Mechanic is used by at least one button in the gallery", () => {
    const usedKeys = new Set(BUTTONS.map((b) => b.styleKey));
    const orphaned = MECHANICS.filter((m) => !usedKeys.has(m.key)).map((m) => m.key);
    expect(orphaned).toEqual([]);
  });
});

describe("variation engine — no duplicate signatures", () => {
  it("assigns a unique signature to each of the 100 buttons", () => {
    const seen = new Map<string, string>();
    const collisions: string[] = [];
    for (const b of BUTTONS) {
      const v = getVariant(b.id, b.styleKey, b.hue);
      const prior = seen.get(v.signature);
      if (prior) collisions.push(`${prior} ⇄ ${b.id}`);
      seen.set(v.signature, b.id);
    }
    expect(collisions).toEqual([]);
  });

  it("raw computeVariant() distinguishes distinct (style,hue) pairs", () => {
    // Sanity: the underlying deterministic function should already avoid
    // collisions even before the runtime salt kicks in. If this ever fails
    // it means the discrete step tables shrank too far.
    const seen = new Set<string>();
    const collisions: string[] = [];
    const styles = [...new Set(BUTTONS.map((b) => b.styleKey))];
    const hues = [...new Set(BUTTONS.map((b) => b.hue))];
    for (const s of styles) {
      for (const h of hues) {
        const sig = computeVariant(s, h).signature;
        if (seen.has(sig)) collisions.push(`${s}/${h}`);
        seen.add(sig);
      }
    }
    // Allow at most 1% collision rate before the runtime salt — anything
    // higher means the engine has lost its variety budget.
    expect(collisions.length).toBeLessThanOrEqual(Math.floor(styles.length * hues.length * 0.01));
  });

  it("uses meaningful variety on every axis (≥3 distinct values across 100 buttons)", () => {
    const variants = BUTTONS.map((b) => getVariant(b.id, b.styleKey, b.hue));
    const axes: (keyof typeof variants[number])[] = [
      "perspective", "rotX", "rotY", "z", "scale", "pressZ",
      "duration", "ease", "originX", "originY",
      "haloMix", "haloBlur", "shadowSpread", "shadowY", "liftY",
    ];
    const thin = axes.filter((a) => new Set(variants.map((v) => v[a])).size < 3);
    expect(thin).toEqual([]);
  });

  it("hue-siblings of the same mechanic differ on ≥5 physical axes (not just recolors)", () => {
    // Group buttons by styleKey. For each mechanic with ≥2 hue variants,
    // check pairwise: two siblings must diverge on at least 5 of the 15
    // engine axes. This is what actually prevents "same button, different
    // gradient" duplication.
    const byStyle = new Map<string, typeof BUTTONS>();
    for (const b of BUTTONS) {
      if (!byStyle.has(b.styleKey)) byStyle.set(b.styleKey, []);
      byStyle.get(b.styleKey)!.push(b);
    }
    const axes = [
      "perspective", "rotX", "rotY", "z", "scale", "pressZ",
      "duration", "ease", "originX", "originY",
      "haloMix", "haloBlur", "shadowSpread", "shadowY", "liftY",
    ] as const;
    const offenders: string[] = [];
    for (const [style, siblings] of byStyle) {
      if (siblings.length < 2) continue;
      const vs = siblings.map((s) => ({
        id: s.id,
        v: getVariant(s.id, s.styleKey, s.hue),
      }));
      for (let i = 0; i < vs.length; i++) {
        for (let j = i + 1; j < vs.length; j++) {
          const diffs = axes.filter((a) => vs[i].v[a] !== vs[j].v[a]).length;
          if (diffs < 5) offenders.push(`${style}: ${vs[i].id} vs ${vs[j].id} (only ${diffs} axes)`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("mechanic catalog — coverage across categories", () => {
  it("spans every documented category", () => {
    const categories = new Set(MECHANICS.map((m) => m.category));
    // 8 categories declared in button-mechanics.ts — all must be populated.
    expect(categories.size).toBe(8);
  });

  it("every mechanic declares at least one trigger and non-empty guidance", () => {
    const bad = MECHANICS.filter(
      (m) => m.triggers.length === 0 || !m.usage.trim() || !m.avoid.trim() || !m.mechanic.trim(),
    );
    expect(bad.map((m) => m.key)).toEqual([]);
  });
});
