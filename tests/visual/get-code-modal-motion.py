"""
Visual regression: "Get code" button + CodeModal layout parity across
both `prefers-reduced-motion` modes.

For each sampled category we:
  1. Screenshot the "Get code" button on a gallery tile.
  2. Click it, wait for the modal to settle, then screenshot:
       • the modal dialog (whole)
       • the modal header row (close/save/link buttons)
       • the modal preview pane
       • the modal code pane
  3. Repeat with `prefers-reduced-motion: reduce`.
  4. Compare bounding boxes and pixels across motion modes — the resting
     layout must not drift between motion / reduced-motion.

Failures write a side-by-side diff PNG + a Markdown/JSON report.

Run:
  python3 tests/visual/get-code-modal-motion.py \
      [--sample N] [--base URL] [--layout-tolerance 1.0] [--pixel-threshold 0.75]

Outputs under tests/visual/out-getcode/:
  <category>/<slug>__button_<mode>.png
  <category>/<slug>__modal_<mode>.png
  <category>/<slug>__header_<mode>.png
  <category>/<slug>__preview_<mode>.png
  <category>/<slug>__code_<mode>.png
  <category>/<slug>__diff.png                (mismatches only)
  report.json / report.md
"""

import argparse
import asyncio
import json
import re
from pathlib import Path

from PIL import Image, ImageChops
from playwright.async_api import async_playwright

ROOT = Path(__file__).parent
OUT = ROOT / "out-getcode"

# One representative from each family. Buttons uses ButtonCard's own footer
# (Get code always visible); the rest go through MiniTile (footer button now
# always visible after the a11y pass).
CATEGORIES = [
    "Buttons",
    "Checkboxes",
    "Toggles",
    "Cards",
    "Loaders",
    "Radio buttons",
    "Tooltips",
    "Inputs",
    "Forms",
    "Patterns",
    "UI Kits",
]

VIEWPORT = {"width": 1440, "height": 1800}


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


async def wait_settled(page, timeout=1500):
    """Best-effort wait for transitions to finish. Ambient loops (marquee,
    aurora) never end, so we swallow timeouts and fall back to a brief pause."""
    try:
        await page.wait_for_function(
            "() => document.getAnimations().filter(a => a.effect && a.effect.getTiming().iterations !== Infinity).every(a => a.playState !== 'running')",
            timeout=timeout,
        )
    except Exception:
        await page.wait_for_timeout(250)


async def snap(locator, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    await locator.screenshot(path=str(path))


def diff_pct(a: Path, b: Path, channel_threshold: int = 16) -> float:
    """% of pixels where max channel difference exceeds `channel_threshold`.
    Ignores sub-threshold AA / gradient noise that isn't a real regression."""
    ia = Image.open(a).convert("RGB")
    ib = Image.open(b).convert("RGB")
    if ia.size != ib.size:
        w = min(ia.size[0], ib.size[0])
        h = min(ia.size[1], ib.size[1])
        ia = ia.crop((0, 0, w, h))
        ib = ib.crop((0, 0, w, h))
    d = ImageChops.difference(ia, ib)
    # Reduce to per-pixel max channel diff, then threshold.
    mask = d.point(lambda v: 255 if v > channel_threshold else 0).convert("L")
    hist = mask.histogram()
    changed = hist[255] if len(hist) > 255 else 0
    total = ia.size[0] * ia.size[1]
    return (changed / total) * 100.0 if total else 0.0


def compose_diff(paths: dict[str, Path], out: Path):
    """4-column strip: motion / reduced / abs diff / heatmap."""
    a = Image.open(paths["motion"]).convert("RGB")
    b = Image.open(paths["reduced"]).convert("RGB")
    w = min(a.size[0], b.size[0])
    h = min(a.size[1], b.size[1])
    a, b = a.crop((0, 0, w, h)), b.crop((0, 0, w, h))
    d = ImageChops.difference(a, b)
    heat = d.point(lambda v: min(255, v * 6))
    strip = Image.new("RGB", (w * 4, h), (10, 10, 12))
    strip.paste(a, (0, 0))
    strip.paste(b, (w, 0))
    strip.paste(d, (w * 2, 0))
    strip.paste(heat, (w * 3, 0))
    out.parent.mkdir(parents=True, exist_ok=True)
    strip.save(out)


async def sample_category(
    context_ctor,
    category: str,
    base: str,
    layout_tol: float,
    pixel_tol: float,
    results: list,
):
    frames: dict[str, dict[str, Path]] = {}
    boxes: dict[str, dict[str, dict]] = {}
    label = slug(category)

    for mode in ("no-preference", "reduce"):
        context = await context_ctor(reduced_motion=mode)
        page = await context.new_page()
        try:
            url = f"{base}/elements?category={category.replace(' ', '+')}"
            await page.goto(url, wait_until="domcontentloaded")
            await page.wait_for_selector("text=Get code", timeout=15000)
            await wait_settled(page)

            # Wait for entrance animations before touching buttons — some
            # cards defer mounting under their tilt containers.
            await page.wait_for_timeout(800)
            # Skip mosaic tiles (index 0..N-1 of them can be masked by tilt/halo
            # overlays that swallow clicks in some motion modes). Pick a
            # gallery-item card whose Get code button is reliably interactive.
            btns = page.locator("button:has-text('Get code')")
            total = await btns.count()
            btn = btns.nth(min(6, total - 1))
            await btn.scroll_into_view_if_needed()
            await btn.evaluate("el => { el.style.opacity = '1'; el.style.transition = 'none'; }")
            await page.wait_for_timeout(300)

            btn_dir = OUT / label
            btn_dir.mkdir(parents=True, exist_ok=True)
            btn_path = btn_dir / f"button_{mode}.png"
            await snap(btn, btn_path)
            btn_box = await btn.bounding_box()

            await btn.evaluate("el => el.click()")
            dialog = page.locator('[role="dialog"]').first
            await dialog.wait_for(state="visible", timeout=8000)
            await wait_settled(page)

            modal_path  = btn_dir / f"modal_{mode}.png"
            header_path = btn_dir / f"header_{mode}.png"
            code_path   = btn_dir / f"code_{mode}.png"
            preview_path = btn_dir / f"preview_{mode}.png"

            await snap(dialog, modal_path)
            modal_box = await dialog.bounding_box()

            header = dialog.locator("xpath=./div[1]").first
            await snap(header, header_path)

            code_region = dialog.get_by_role("region").first
            if await code_region.count():
                await snap(code_region, code_path)
            preview = dialog.locator("xpath=.//div[contains(@class,'origin-top-left')]/..").first
            if await preview.count():
                await snap(preview, preview_path)

            frames.setdefault("button",  {})[mode] = btn_path
            frames.setdefault("modal",   {})[mode] = modal_path
            frames.setdefault("header",  {})[mode] = header_path
            if code_path.exists():
                frames.setdefault("code", {})[mode] = code_path
            if preview_path.exists():
                frames.setdefault("preview", {})[mode] = preview_path

            boxes.setdefault("button", {})[mode] = btn_box
            boxes.setdefault("modal",  {})[mode] = modal_box
        finally:
            await context.close()

    # Compare motion vs reduced for each captured surface
    for surface, paths in frames.items():
        if "motion" not in paths and "no-preference" in paths:
            paths["motion"] = paths.pop("no-preference")
        if not ({"motion", "reduce"} <= set(paths.keys())):
            continue
        motion_p, reduce_p = paths["motion"], paths["reduce"]
        pct = diff_pct(motion_p, reduce_p)

        box_drift = None
        if surface in boxes:
            m, r = boxes[surface].get("motion"), boxes[surface].get("reduce")
            if m and r:
                box_drift = max(
                    abs(m["x"] - r["x"]), abs(m["y"] - r["y"]),
                    abs(m["width"] - r["width"]), abs(m["height"] - r["height"]),
                )

        ok_pixels = pct <= pixel_tol
        ok_layout = box_drift is None or box_drift <= layout_tol
        ok = ok_pixels and ok_layout

        if not ok:
            compose_diff(
                {"motion": motion_p, "reduced": reduce_p},
                OUT / label / f"{surface}__diff.png",
            )

        results.append({
            "category": category,
            "surface": surface,
            "pixel_diff_pct": round(pct, 3),
            "box_drift_px": None if box_drift is None else round(box_drift, 2),
            "pass": ok,
        })


async def run(args):
    OUT.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        async def ctor(reduced_motion: str):
            return await browser.new_context(
                viewport=VIEWPORT,
                reduced_motion=reduced_motion,
                device_scale_factor=1,
            )

        results: list = []
        cats = CATEGORIES if args.all else CATEGORIES[: args.sample]
        for c in cats:
            print(f"→ {c}")
            try:
                await sample_category(ctor, c, args.base, args.layout_tolerance, args.pixel_threshold, results)
            except Exception as e:
                results.append({"category": c, "surface": "*", "error": str(e), "pass": False})

        await browser.close()

    (OUT / "report.json").write_text(json.dumps(results, indent=2))
    lines = ["# Get code / CodeModal — reduced-motion parity\n"]
    lines.append(f"- Layout tolerance: **{args.layout_tolerance}px**")
    lines.append(f"- Pixel tolerance:  **{args.pixel_threshold}%**\n")
    lines.append("| Category | Surface | Δ pixels % | Δ box px | Pass |")
    lines.append("|---|---|---:|---:|:-:|")
    for r in results:
        lines.append(
            f"| {r.get('category','')} | {r.get('surface','')} | "
            f"{r.get('pixel_diff_pct','—')} | {r.get('box_drift_px','—')} | "
            f"{'✅' if r.get('pass') else '❌'} |"
        )
    (OUT / "report.md").write_text("\n".join(lines))

    failed = [r for r in results if not r.get("pass")]
    print(f"\n{'PASS' if not failed else 'FAIL'} — {len(results)} checks, {len(failed)} mismatches")
    print(f"Report: {OUT / 'report.md'}")
    return 0 if not failed else 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://localhost:8080")
    ap.add_argument("--sample", type=int, default=4, help="How many categories to sample (default 4)")
    ap.add_argument("--all", action="store_true", help="Run all categories")
    ap.add_argument("--pixel-threshold", type=float, default=0.75)
    ap.add_argument("--layout-tolerance", type=float, default=1.0)
    args = ap.parse_args()
    raise SystemExit(asyncio.run(run(args)))


if __name__ == "__main__":
    main()
