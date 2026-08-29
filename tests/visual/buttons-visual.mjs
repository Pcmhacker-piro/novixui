#!/usr/bin/env node
/**
 * Novix UI — 100-button gallery visual regression.
 *
 * What this catches that the unit tests can't
 * -------------------------------------------
 * The Vitest suite verifies that every button has a unique *variation
 * signature*. This script verifies that those signatures actually PAINT
 * differently — i.e. two mechanics can't converge to visually near-identical
 * renders even though their engine parameters differ.
 *
 * How it works
 * ------------
 * 1. Launches headless Chromium, opens /elements at 1440×2400.
 * 2. Screenshots each `.nova-btn-tile` element individually, downsampled to
 *    16×16 grayscale, and computes a dHash (256-bit).
 * 3. Compares every pair of tiles from DIFFERENT mechanics. If Hamming
 *    distance ≤ NEAR_DUP_THRESHOLD, the pair is flagged as a near-duplicate
 *    render and the run fails with an exit code.
 * 4. Writes per-tile PNGs + a JSON report to tests/visual/__snapshots__/.
 *
 * Two tiles of the SAME mechanic (different hues) are allowed to look alike
 * on the still frame — they only diverge on hover motion, which a static
 * screenshot can't capture. Cross-mechanic similarity is the real risk.
 *
 * Usage
 * -----
 *   # dev server must be running on http://localhost:8080
 *   node tests/visual/buttons-visual.mjs
 *   node tests/visual/buttons-visual.mjs --threshold 18   # stricter
 *   node tests/visual/buttons-visual.mjs --update         # refresh snapshots
 */
import { chromium } from "playwright";
import { PNG } from "pngjs";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNAP_DIR = path.join(__dirname, "__snapshots__");
const REPORT = path.join(SNAP_DIR, "report.json");

const args = process.argv.slice(2);
const flag = (k, dflt) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] ?? true : dflt;
};

const URL_BASE = flag("url", "http://localhost:8080");
const NEAR_DUP_THRESHOLD = Number(flag("threshold", 22)); // Hamming distance
const HASH_SIZE = 16; // 16×15 dHash = 240 bits, robust to color shift
const UPDATE = args.includes("--update");

/* ------------------------------------------------------------------ */
/*  Perceptual hashing (dHash)                                         */
/* ------------------------------------------------------------------ */

/** Decode PNG buffer → { w, h, gray Uint8ClampedArray }. */
function pngToGray(buf) {
  const png = PNG.sync.read(buf);
  const gray = new Uint8ClampedArray(png.width * png.height);
  for (let i = 0, j = 0; i < png.data.length; i += 4, j++) {
    // Rec. 601 luma
    gray[j] = (png.data[i] * 299 + png.data[i + 1] * 587 + png.data[i + 2] * 114) / 1000;
  }
  return { w: png.width, h: png.height, gray };
}

/** Nearest-neighbor downsample of a grayscale image. */
function resize(src, srcW, srcH, dstW, dstH) {
  const out = new Uint8ClampedArray(dstW * dstH);
  for (let y = 0; y < dstH; y++) {
    const sy = Math.min(srcH - 1, Math.floor((y * srcH) / dstH));
    for (let x = 0; x < dstW; x++) {
      const sx = Math.min(srcW - 1, Math.floor((x * srcW) / dstW));
      out[y * dstW + x] = src[sy * srcW + sx];
    }
  }
  return out;
}

/** dHash: compare adjacent pixels; bit set if left > right. */
function dHash(gray, w, h) {
  const bits = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w - 1; x++) {
      bits.push(gray[y * w + x] > gray[y * w + x + 1] ? 1 : 0);
    }
  }
  return bits;
}

function hamming(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

function bitsToHex(bits) {
  let hex = "";
  for (let i = 0; i < bits.length; i += 4) {
    const nib = (bits[i] << 3) | (bits[i + 1] << 2) | (bits[i + 2] << 1) | bits[i + 3];
    hex += nib.toString(16);
  }
  return hex;
}

/* ------------------------------------------------------------------ */
/*  Capture                                                            */
/* ------------------------------------------------------------------ */

async function capture() {
  if (existsSync(SNAP_DIR) && UPDATE) await rm(SNAP_DIR, { recursive: true });
  await mkdir(SNAP_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 2400 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce", // freeze loops so hashes are stable
    colorScheme: "dark",
  });
  const page = await context.newPage();

  console.log(`→ opening ${URL_BASE}/elements`);
  await page.goto(`${URL_BASE}/elements`, { waitUntil: "domcontentloaded", timeout: 30_000 });

  // Wait for gallery to hydrate and lay out.
  await page.waitForSelector(".nova-btn-tile", { timeout: 20_000 });
  await page.waitForTimeout(600);

  const tiles = await page.locator(".nova-btn-tile").all();
  console.log(`→ found ${tiles.length} tiles`);

  const records = [];
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    // Scroll into view so lazy content / halos are settled.
    await tile.scrollIntoViewIfNeeded();
    await page.waitForTimeout(30);
    const label = (await tile.getAttribute("aria-label")) ?? `tile-${i}`;
    // aria-label format: "<Style Name> — view code"
    const name = label.replace(/\s+—\s+view code$/i, "").trim();
    const styleKey = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const buf = await tile.screenshot({ omitBackground: false });
    const { w, h, gray } = pngToGray(buf);
    const small = resize(gray, w, h, HASH_SIZE, HASH_SIZE - 1);
    const bits = dHash(small, HASH_SIZE, HASH_SIZE - 1);
    const hash = bitsToHex(bits);

    const file = path.join(SNAP_DIR, `${String(i).padStart(3, "0")}-${styleKey}.png`);
    await writeFile(file, buf);
    records.push({ i, name, styleKey, hash, bits, file: path.relative(SNAP_DIR, file) });
  }

  await browser.close();
  return records;
}

/* ------------------------------------------------------------------ */
/*  Pairwise near-duplicate detection                                  */
/* ------------------------------------------------------------------ */

function findNearDuplicates(records, threshold) {
  const flagged = [];
  for (let i = 0; i < records.length; i++) {
    for (let j = i + 1; j < records.length; j++) {
      const a = records[i], b = records[j];
      // Same mechanic = expected to look alike statically. Skip.
      if (a.styleKey === b.styleKey) continue;
      const d = hamming(a.bits, b.bits);
      if (d <= threshold) flagged.push({ a: a.name, b: b.name, distance: d, files: [a.file, b.file] });
    }
  }
  flagged.sort((x, y) => x.distance - y.distance);
  return flagged;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

(async () => {
  const records = await capture();
  const flagged = findNearDuplicates(records, NEAR_DUP_THRESHOLD);

  const report = {
    generatedAt: new Date().toISOString(),
    url: `${URL_BASE}/elements`,
    tileCount: records.length,
    hashBits: records[0]?.bits.length ?? 0,
    threshold: NEAR_DUP_THRESHOLD,
    tiles: records.map(({ bits, ...r }) => r), // strip bit arrays from report
    nearDuplicates: flagged,
  };
  await writeFile(REPORT, JSON.stringify(report, null, 2));

  console.log(`\nreport → ${path.relative(process.cwd(), REPORT)}`);
  console.log(`tiles captured: ${records.length}`);
  console.log(`near-duplicate pairs (Hamming ≤ ${NEAR_DUP_THRESHOLD}): ${flagged.length}`);

  if (flagged.length > 0) {
    console.error("\n✗ VISUAL REGRESSION FAILED — cross-mechanic near-duplicates detected:");
    for (const p of flagged.slice(0, 25)) {
      console.error(`   d=${String(p.distance).padStart(3)}  ${p.a}  ⇄  ${p.b}`);
    }
    if (flagged.length > 25) console.error(`   … and ${flagged.length - 25} more (see report.json)`);
    process.exit(1);
  }

  console.log("✓ no near-duplicate cross-mechanic renders");
})().catch((err) => {
  console.error(err);
  process.exit(2);
});
