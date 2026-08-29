# Visual regression — 100-button gallery

Two layers work together to prevent style duplication in the button gallery:

| Layer | File | Runs | Catches |
| --- | --- | --- | --- |
| Structural (fast) | `src/nova/ui/__tests__/buttons-uniqueness.test.ts` | `bunx vitest run` | Duplicate variation signatures, undocumented mechanics, hue-siblings that are recolors, thin axis variance. |
| Perceptual (slow) | `tests/visual/buttons-visual.mjs` | on-demand / nightly | Two DIFFERENT mechanics that paint to near-identical pixels despite unique engine params. |

## Perceptual regression

Requires the dev server on `http://localhost:8080`.

```bash
# first run — establishes baseline
node tests/visual/buttons-visual.mjs --update

# subsequent runs — fails if new near-duplicates appear
node tests/visual/buttons-visual.mjs

# stricter threshold (default: 22 bits out of 240)
node tests/visual/buttons-visual.mjs --threshold 18
```

### How it works

1. Playwright opens `/elements` at 1440×2400 with `prefers-reduced-motion:
   reduce` (freezes loops so hashes are stable).
2. Each `.nova-btn-tile` is screenshotted individually and hashed with dHash
   (16×15 grid → 240 bits, robust to color/hue shifts).
3. Every pair from **different mechanics** is compared. Hamming distance ≤
   threshold ⇒ flagged as a near-duplicate render.
4. Pairs from the SAME mechanic (different hues) are allowed to match — they
   diverge only on hover motion, which a still frame can't capture.

Artifacts land in `tests/visual/__snapshots__/`:

- `NNN-<style>.png` — per-tile screenshot
- `report.json` — hashes, tile metadata, and any flagged pairs

### Tuning

- **Too many false positives**: raise `--threshold` (e.g. `--threshold 28`).
- **Missed obvious duplicates**: lower it (`--threshold 14`).
- **New legitimate style added**: run with `--update` to refresh snapshots.
