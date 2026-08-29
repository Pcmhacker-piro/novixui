"""
Visual parity test: for each element category on /elements, screenshot the
gallery card and the corresponding open-modal preview, then compare them
pixel-by-pixel. A tile only fails if the pixel diff exceeds a small
threshold — catching spacing/alignment drift, not just bounding-box drift.

Run:  python3 tests/visual/card-vs-modal.py [--sample N] [--all] [--base URL]
             [--pixel-threshold 1.5] [--pixel-tolerance 12]
             [--layout-tolerance 0.08]

Outputs under tests/visual/out/:
  <category>/<slug>__card.png
  <category>/<slug>__modal.png
  <category>/<slug>__diff.png       (side-by-side + heat-map, only on mismatch)
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
OUT = ROOT / "out"

# (category label on sidebar, host-attr used by modal preview or None)
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


def ratio(a: float, b: float) -> float:
    return a / b if b else 0.0


def pixel_diff(card_png: Path, modal_png: Path, per_channel_tol: int):
    """Resize both to a common canvas and compute % of pixels that differ
    beyond `per_channel_tol` on any channel. Returns (pct, heatmap Image)."""
    a = Image.open(card_png).convert("RGB")
    b = Image.open(modal_png).convert("RGB")
    # normalize to the smaller side to avoid over-weighting scale differences
    w = min(a.width, b.width)
    h = min(a.height, b.height)
    if w < 8 or h < 8:
        return 0.0, None
    a = a.resize((w, h), Image.LANCZOS)
    b = b.resize((w, h), Image.LANCZOS)
    diff = ImageChops.difference(a, b)
    # per-pixel max channel diff
    max_channel = diff.convert("L")  # cheap luminance-ish reduction
    # count pixels above tolerance
    hist = max_channel.point(lambda v: 255 if v > per_channel_tol else 0)
    pixels = list(hist.getdata())
    over = sum(1 for v in pixels if v)
    pct = 100.0 * over / (w * h)
    # heat map (red-tint where over threshold, dark elsewhere)
    heat = Image.new("RGB", (w, h), (10, 10, 12))
    heat.paste((220, 40, 60), mask=hist)
    return pct, heat


def compose(card_png: Path, modal_png: Path, heat: Image.Image | None, out_png: Path) -> None:
    a = Image.open(card_png).convert("RGBA")
    b = Image.open(modal_png).convert("RGBA")
    panels = [a, b] + ([heat.convert("RGBA")] if heat is not None else [])
    gap = 24
    h = max(p.height for p in panels)
    w = sum(p.width for p in panels) + gap * (len(panels) - 1)
    canvas = Image.new("RGBA", (w, h), (10, 10, 12, 255))
    x = 0
    for p in panels:
        canvas.paste(p, (x, (h - p.height) // 2))
        x += p.width + gap
    canvas.save(out_png)


async def check_category(page, base: str, cat: str, host_attr: str | None,
                         sample: int | None, thresholds: dict, report: list):
    slug_dir = OUT / slugify(cat)
    slug_dir.mkdir(parents=True, exist_ok=True)

    url = f"{base}/elements?category={cat.replace(' ', '%20')}"
    await page.goto(url, wait_until="domcontentloaded")
    try:
        await page.wait_for_selector(TILE_SELECTOR, timeout=10_000)
    except Exception as e:
        report.append({"category": cat, "error": f"no-tiles: {e}"})
        return

    all_tiles = await page.locator(TILE_SELECTOR).all()
    indices: list[int] = []
    for idx, t in enumerate(all_tiles):
        if await t.locator("button", has_text="Get code").count() > 0:
            indices.append(idx)
    if sample:
        indices = indices[:sample]
    print(f"\n== {cat} ==  {len(indices)} tile(s)")

    for i in indices:
        entry: dict = {"category": cat, "index": i}
        tile = page.locator(TILE_SELECTOR).nth(i)
        btn = tile.locator("button", has_text="Get code").first
        if await btn.count() == 0:
            entry["error"] = "no-get-code-button"
            report.append(entry)
            continue

        aria = await btn.get_attribute("aria-label") or f"item-{i}"
        name = aria.split("—")[0].strip() if "—" in aria else aria
        slug = slugify(name) or f"item-{i}"
        entry["name"] = name
        entry["slug"] = slug

        await tile.scroll_into_view_if_needed(timeout=3000)
        await tile.hover()
        card_box = await tile.bounding_box()
        if not card_box:
            entry["error"] = "no-card-box"
            report.append(entry)
            continue

        card_png = slug_dir / f"{slug}__card.png"
        try:
            await tile.screenshot(path=str(card_png))
        except Exception as e:
            entry["error"] = f"card-screenshot: {e}"
            report.append(entry)
            continue

        try:
            await btn.scroll_into_view_if_needed(timeout=2000)
            await btn.click(force=True, timeout=3000)
            await page.wait_for_selector("[role=dialog]", timeout=4000)
        except Exception as e:
            entry["error"] = f"modal-open: {e}"
            report.append(entry)
            continue

        if host_attr:
            preview_sel = f"[role=dialog] [{host_attr}]"
        else:
            preview_sel = "[role=dialog] .relative.z-10 > div > div"

        preview = page.locator(preview_sel).first
        modal_box = None
        if await preview.count() > 0:
            modal_box = await preview.bounding_box()

        if not modal_box:
            entry["error"] = f"preview-missing ({preview_sel})"
            await page.keyboard.press("Escape")
            report.append(entry)
            continue

        modal_png = slug_dir / f"{slug}__modal.png"
        try:
            await preview.screenshot(path=str(modal_png))
        except Exception as e:
            entry["error"] = f"modal-screenshot: {e}"
            await page.keyboard.press("Escape")
            report.append(entry)
            continue

        wr = ratio(modal_box["width"],  card_box["width"])
        hr = ratio(modal_box["height"], card_box["height"])
        card_ar = ratio(card_box["width"],  card_box["height"])
        modal_ar = ratio(modal_box["width"], modal_box["height"])
        ar_delta = abs(card_ar - modal_ar)

        pct, heat = pixel_diff(card_png, modal_png, thresholds["pixel_tolerance"])

        reasons = []
        # Layout drift only fails on a large gap (>= layout-tolerance).
        lt = thresholds["layout_tolerance"]
        if not (1 - lt <= wr <= 1 + lt):
            reasons.append(f"width-ratio={wr:.2f}")
        if not (1 - lt <= hr <= 1 + lt):
            reasons.append(f"height-ratio={hr:.2f}")
        if ar_delta > lt:
            reasons.append(f"aspect-delta={ar_delta:.2f}")
        # Pixel diff — small threshold catches spacing/alignment issues.
        if pct > thresholds["pixel_threshold"]:
            reasons.append(f"pixel-diff={pct:.2f}%")

        entry.update({
            "card":  {"w": round(card_box["width"], 1),  "h": round(card_box["height"], 1)},
            "modal": {"w": round(modal_box["width"], 1), "h": round(modal_box["height"], 1)},
            "width_ratio": round(wr, 3),
            "height_ratio": round(hr, 3),
            "aspect_delta": round(ar_delta, 3),
            "pixel_diff_pct": round(pct, 3),
        })
        if reasons:
            entry["mismatch"] = reasons
            diff_png = slug_dir / f"{slug}__diff.png"
            compose(card_png, modal_png, heat, diff_png)
            entry["diff"] = str(diff_png.relative_to(ROOT))
            print(f"  ✗ {name}: {', '.join(reasons)}")
        else:
            print(f"  ✓ {name}  (pixel-diff={pct:.2f}%)")
        report.append(entry)

        await page.keyboard.press("Escape")
        try:
            await page.wait_for_selector("[role=dialog]", state="detached", timeout=3000)
        except Exception:
            await page.goto(url, wait_until="domcontentloaded")
            await page.wait_for_selector(TILE_SELECTOR, timeout=10_000)


async def run(base: str, sample: int | None, thresholds: dict) -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    report: list[dict] = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 1800})
        page = await context.new_page()
        for cat, host_attr in CATEGORIES:
            try:
                await check_category(page, base, cat, host_attr, sample, thresholds, report)
            except Exception as e:
                print(f"  ! {cat}: {e}")
                report.append({"category": cat, "error": f"uncaught: {e}"})
        await browser.close()

    (OUT / "report.json").write_text(json.dumps(report, indent=2))

    checked = [r for r in report if "index" in r]
    bad = [r for r in checked if r.get("mismatch") or r.get("error")]
    lines = [
        "# Card vs Modal parity report",
        "",
        f"- checked: **{len(checked)}**",
        f"- mismatches / errors: **{len(bad)}**",
        f"- thresholds: pixel≤{thresholds['pixel_threshold']}% "
        f"(per-channel tol {thresholds['pixel_tolerance']}), "
        f"layout≤±{int(thresholds['layout_tolerance']*100)}%",
        "",
    ]
    if bad:
        lines += ["| Category | Item | Issue | pixel% | diff |", "|---|---|---|---|---|"]
        for m in bad:
            issue = m.get("error") or ", ".join(m.get("mismatch", []))
            diff = m.get("diff", "")
            pct = m.get("pixel_diff_pct", "—")
            lines.append(f"| {m['category']} | {m.get('name','—')} | {issue} | {pct} | {diff} |")
    (OUT / "report.md").write_text("\n".join(lines))
    print(f"\nReport: {OUT/'report.md'}  ({len(bad)} issues / {len(checked)} checked)")
    return 1 if bad else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default=os.environ.get("BASE_URL", "http://localhost:8080"))
    ap.add_argument("--sample", type=int, default=3, help="tiles per category (0 = all)")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--pixel-threshold", type=float, default=1.5,
                    help="max %% of pixels allowed to differ (default 1.5)")
    ap.add_argument("--pixel-tolerance", type=int, default=12,
                    help="per-pixel channel tolerance 0-255 (default 12)")
    ap.add_argument("--layout-tolerance", type=float, default=0.08,
                    help="allowed width/height/aspect drift (default 0.08 = ±8%%)")
    args = ap.parse_args()
    sample = None if args.all or args.sample == 0 else args.sample
    thresholds = {
        "pixel_threshold": args.pixel_threshold,
        "pixel_tolerance": args.pixel_tolerance,
        "layout_tolerance": args.layout_tolerance,
    }
    raise SystemExit(asyncio.run(run(args.base, sample, thresholds)))


if __name__ == "__main__":
    main()
