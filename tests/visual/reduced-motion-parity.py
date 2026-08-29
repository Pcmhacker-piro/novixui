"""
Reduced-motion parity check for /elements card ↔ modal transitions.

For each sampled tile we capture the card AND its modal preview twice:
  • once with `prefers-reduced-motion: no-preference`
  • once with `prefers-reduced-motion: reduce`

We then verify that motion mode does NOT drift layout or spacing:

  1. Bounding box parity  — card box (motion vs reduced) and modal box
     (motion vs reduced) must match within `--layout-tolerance` (default 1px).
  2. Pixel parity         — same-source screenshots taken at settle time in
     each motion mode must match within `--pixel-threshold` (default 0.75%).
  3. Cross-mode card↔modal — the card/modal size ratio must be identical in
     both motion modes within `--ratio-tolerance` (default 0.02).

Animations are allowed — they just can't shift the final resting layout.
We wait for `animation-*: none` settle time before every screenshot.

Run:
  python3 tests/visual/reduced-motion-parity.py [--sample N] [--all]
          [--pixel-threshold 0.75] [--layout-tolerance 1.0]
          [--ratio-tolerance 0.02] [--base URL]

Outputs under tests/visual/out-motion/:
  <category>/<slug>__card_motion.png
  <category>/<slug>__card_reduced.png
  <category>/<slug>__modal_motion.png
  <category>/<slug>__modal_reduced.png
  <category>/<slug>__diff.png          (only on mismatch)
  report.json / report.md
"""

import argparse
import asyncio
import json
import os
import re
from pathlib import Path

from PIL import Image, ImageChops
from playwright.async_api import async_playwright

ROOT = Path(__file__).parent
OUT = ROOT / "out-motion"

CATEGORIES = [
    ("UI Kits",       "data-kt-hover-host"),
    ("Buttons",       None),
    ("Checkboxes",    "data-cb-hover-host"),
    ("Toggles",       "data-tg-hover-host"),
    ("Cards",         "data-cd-hover-host"),
    ("Loaders",       "data-ld-hover-host"),
    ("Radio buttons", "data-rd-hover-host"),
    ("Tooltips",      "data-tp-hover-host"),
    ("Inputs",        "data-in-hover-host"),
    ("Forms",         "data-fm-hover-host"),
    ("Patterns",      "data-pt-hover-host"),
]

TILE_SELECTOR = ".grid.grid-cols-1 > div"


def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-") or "item"


def box_delta(a: dict, b: dict) -> dict:
    return {
        "dx": round(abs(a["x"] - b["x"]), 2),
        "dy": round(abs(a["y"] - b["y"]), 2),
        "dw": round(abs(a["width"]  - b["width"]),  2),
        "dh": round(abs(a["height"] - b["height"]), 2),
    }


def box_max(delta: dict) -> float:
    return max(delta["dx"], delta["dy"], delta["dw"], delta["dh"])


def pixel_diff(a_png: Path, b_png: Path, channel_tol: int):
    """Percent of pixels differing beyond `channel_tol` on any channel."""
    a = Image.open(a_png).convert("RGB")
    b = Image.open(b_png).convert("RGB")
    w = min(a.width, b.width)
    h = min(a.height, b.height)
    if w == 0 or h == 0:
        return 100.0, None
    a = a.resize((w, h)); b = b.resize((w, h))
    diff = ImageChops.difference(a, b).load()
    heat = Image.new("RGB", (w, h), (0, 0, 0))
    heat_px = heat.load()
    bad = 0
    total = w * h
    for y in range(h):
        for x in range(w):
            r, g, bl = diff[x, y]
            if r > channel_tol or g > channel_tol or bl > channel_tol:
                bad += 1
                heat_px[x, y] = (255, 40, 40)
    return (bad / total) * 100.0, heat


def compose(m_png: Path, r_png: Path, heat: Image.Image | None, dest: Path):
    m = Image.open(m_png).convert("RGB")
    r = Image.open(r_png).convert("RGB")
    w = max(m.width, r.width, heat.width if heat else 0)
    h = max(m.height, r.height, heat.height if heat else 0)
    canvas = Image.new("RGB", (w * 3 + 24, h + 12), (10, 10, 10))
    canvas.paste(m.resize((w, h)), (0, 6))
    canvas.paste(r.resize((w, h)), (w + 12, 6))
    if heat:
        canvas.paste(heat.resize((w, h)), (w * 2 + 24, 6))
    canvas.save(dest)


async def settle(page):
    """Wait for the DOM to stop animating: no active transitions/animations."""
    await page.wait_for_load_state("networkidle")
    # Poll until getAnimations() reports none running.
    await page.wait_for_function(
        """() => {
            const anims = document.getAnimations ? document.getAnimations() : [];
            return anims.every(a => a.playState !== 'running');
        }""",
        timeout=4000,
    )
    # Extra micro-tick for spring physics that fall below the anims threshold.
    await page.wait_for_timeout(120)


async def capture_pair(page, base, cat, host_attr, tile_index, tag, out_dir, slug):
    """Screenshot the (card, modal) pair for the current motion mode."""
    url = f"{base}/elements?category={cat.replace(' ', '%20')}"
    await page.goto(url, wait_until="domcontentloaded")
    await page.wait_for_selector(TILE_SELECTOR, timeout=10_000)
    await settle(page)

    tile = page.locator(TILE_SELECTOR).nth(tile_index)
    await tile.scroll_into_view_if_needed(timeout=3000)
    await tile.hover()
    await settle(page)

    card_box = await tile.bounding_box()
    card_png = out_dir / f"{slug}__card_{tag}.png"
    await tile.screenshot(path=str(card_png))

    btn = tile.locator("button", has_text="Get code").first
    await btn.click(force=True, timeout=3000)
    await page.wait_for_selector("[role=dialog]", timeout=4000)
    await settle(page)

    preview_sel = (
        f"[role=dialog] [{host_attr}]" if host_attr
        else "[role=dialog] .relative.z-10 > div > div"
    )
    preview = page.locator(preview_sel).first
    if await preview.count() == 0:
        await page.keyboard.press("Escape")
        return card_box, card_png, None, None
    modal_box = await preview.bounding_box()
    modal_png = out_dir / f"{slug}__modal_{tag}.png"
    await preview.screenshot(path=str(modal_png))

    await page.keyboard.press("Escape")
    try:
        await page.wait_for_selector("[role=dialog]", state="detached", timeout=3000)
    except Exception:
        pass
    return card_box, card_png, modal_box, modal_png


async def check_category(browser, base, cat, host_attr, sample, thresholds, report):
    slug_dir = OUT / slugify(cat)
    slug_dir.mkdir(parents=True, exist_ok=True)

    # Discover tiles once with a plain context.
    probe_ctx = await browser.new_context(viewport={"width": 1440, "height": 1800})
    probe = await probe_ctx.new_page()
    url = f"{base}/elements?category={cat.replace(' ', '%20')}"
    await probe.goto(url, wait_until="domcontentloaded")
    try:
        await probe.wait_for_selector(TILE_SELECTOR, timeout=10_000)
    except Exception as e:
        report.append({"category": cat, "error": f"no-tiles: {e}"})
        await probe_ctx.close()
        return

    tiles = await probe.locator(TILE_SELECTOR).all()
    indices, names = [], []
    for idx, t in enumerate(tiles):
        btn = t.locator("button", has_text="Get code").first
        if await btn.count() == 0:
            continue
        aria = await btn.get_attribute("aria-label") or f"item-{idx}"
        names.append(aria.split("—")[0].strip() if "—" in aria else aria)
        indices.append(idx)
    await probe_ctx.close()
    if sample:
        indices = indices[:sample]
        names   = names[:sample]

    print(f"\n== {cat} ==  {len(indices)} tile(s)")

    # Two contexts, one per motion mode — cheaper than toggling per page.
    ctx_motion  = await browser.new_context(
        viewport={"width": 1440, "height": 1800},
        reduced_motion="no-preference",
    )
    ctx_reduced = await browser.new_context(
        viewport={"width": 1440, "height": 1800},
        reduced_motion="reduce",
    )
    page_motion  = await ctx_motion.new_page()
    page_reduced = await ctx_reduced.new_page()

    for i, name in zip(indices, names):
        slug = slugify(name)
        entry: dict = {"category": cat, "name": name, "slug": slug, "index": i}
        try:
            m_card_box, m_card_png, m_mod_box, m_mod_png = await capture_pair(
                page_motion,  base, cat, host_attr, i, "motion",  slug_dir, slug,
            )
            r_card_box, r_card_png, r_mod_box, r_mod_png = await capture_pair(
                page_reduced, base, cat, host_attr, i, "reduced", slug_dir, slug,
            )
        except Exception as e:
            entry["error"] = f"capture: {e}"
            report.append(entry)
            print(f"  ! {name}: {e}")
            continue

        if not (m_card_box and r_card_box and m_mod_box and r_mod_box):
            entry["error"] = "preview-missing"
            report.append(entry)
            print(f"  ! {name}: preview missing")
            continue

        card_delta  = box_delta(m_card_box, r_card_box)
        modal_delta = box_delta(m_mod_box,  r_mod_box)

        card_pct,  card_heat  = pixel_diff(m_card_png, r_card_png, thresholds["pixel_tolerance"])
        modal_pct, modal_heat = pixel_diff(m_mod_png,  r_mod_png,  thresholds["pixel_tolerance"])

        m_ratio = m_mod_box["width"] / m_card_box["width"] if m_card_box["width"] else 0
        r_ratio = r_mod_box["width"] / r_card_box["width"] if r_card_box["width"] else 0
        ratio_delta = round(abs(m_ratio - r_ratio), 4)

        reasons = []
        lt = thresholds["layout_tolerance"]
        if box_max(card_delta)  > lt:
            reasons.append(f"card-box-drift={card_delta}")
        if box_max(modal_delta) > lt:
            reasons.append(f"modal-box-drift={modal_delta}")
        if card_pct  > thresholds["pixel_threshold"]:
            reasons.append(f"card-pixel-diff={card_pct:.2f}%")
        if modal_pct > thresholds["pixel_threshold"]:
            reasons.append(f"modal-pixel-diff={modal_pct:.2f}%")
        if ratio_delta > thresholds["ratio_tolerance"]:
            reasons.append(f"card-modal-ratio-drift={ratio_delta}")

        entry.update({
            "card_box_delta":  card_delta,
            "modal_box_delta": modal_delta,
            "card_pixel_pct":  round(card_pct, 3),
            "modal_pixel_pct": round(modal_pct, 3),
            "motion_ratio":    round(m_ratio, 3),
            "reduced_ratio":   round(r_ratio, 3),
            "ratio_delta":     ratio_delta,
        })
        if reasons:
            entry["mismatch"] = reasons
            # Prefer the modal diff heat map, fall back to card.
            heat = modal_heat if modal_pct >= card_pct else card_heat
            m_ref = m_mod_png if modal_pct >= card_pct else m_card_png
            r_ref = r_mod_png if modal_pct >= card_pct else r_card_png
            diff_png = slug_dir / f"{slug}__diff.png"
            compose(m_ref, r_ref, heat, diff_png)
            entry["diff"] = str(diff_png.relative_to(ROOT))
            print(f"  ✗ {name}: {'; '.join(reasons)}")
        else:
            print(f"  ✓ {name}  (card={card_pct:.2f}%, modal={modal_pct:.2f}%, Δratio={ratio_delta})")
        report.append(entry)

    await ctx_motion.close()
    await ctx_reduced.close()


async def run(base, sample, thresholds) -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    report: list[dict] = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        for cat, host_attr in CATEGORIES:
            try:
                await check_category(browser, base, cat, host_attr, sample, thresholds, report)
            except Exception as e:
                print(f"  ! {cat}: {e}")
                report.append({"category": cat, "error": f"uncaught: {e}"})
        await browser.close()

    (OUT / "report.json").write_text(json.dumps(report, indent=2))
    checked = [r for r in report if "index" in r]
    bad = [r for r in checked if r.get("mismatch") or r.get("error")]
    lines = [
        "# Reduced-motion parity report",
        "",
        f"- checked: **{len(checked)}**",
        f"- mismatches / errors: **{len(bad)}**",
        f"- thresholds: pixel≤{thresholds['pixel_threshold']}% "
        f"(per-channel tol {thresholds['pixel_tolerance']}), "
        f"layout≤{thresholds['layout_tolerance']}px, "
        f"ratio≤{thresholds['ratio_tolerance']}",
        "",
    ]
    if bad:
        lines += ["| Category | Item | Issue | diff |", "|---|---|---|---|"]
        for m in bad:
            issue = m.get("error") or "; ".join(m.get("mismatch", []))
            lines.append(f"| {m['category']} | {m.get('name','—')} | {issue} | {m.get('diff','')} |")
    (OUT / "report.md").write_text("\n".join(lines))
    print(f"\nReport: {OUT/'report.md'}  ({len(bad)} issues / {len(checked)} checked)")
    return 1 if bad else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default=os.environ.get("BASE_URL", "http://localhost:8080"))
    ap.add_argument("--sample", type=int, default=3, help="tiles per category (0 = all)")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--pixel-threshold", type=float, default=0.75,
                    help="max %% of pixels allowed to differ between motion modes (default 0.75)")
    ap.add_argument("--pixel-tolerance", type=int, default=12,
                    help="per-pixel channel tolerance 0-255 (default 12)")
    ap.add_argument("--layout-tolerance", type=float, default=1.0,
                    help="max px drift for x/y/w/h between motion modes (default 1.0)")
    ap.add_argument("--ratio-tolerance", type=float, default=0.02,
                    help="max |motionRatio − reducedRatio| for card/modal width (default 0.02)")
    args = ap.parse_args()
    sample = None if args.all or args.sample == 0 else args.sample
    thresholds = {
        "pixel_threshold":  args.pixel_threshold,
        "pixel_tolerance":  args.pixel_tolerance,
        "layout_tolerance": args.layout_tolerance,
        "ratio_tolerance":  args.ratio_tolerance,
    }
    raise SystemExit(asyncio.run(run(args.base, sample, thresholds)))


if __name__ == "__main__":
    main()
