"""
Computed-style parity: for each element category on /elements, compare the
computed padding / gap / alignment of the gallery card's inner host against
the modal preview's inner host. Fails when any axis drifts beyond a small
pixel tolerance — catches spacing/alignment regressions that pixel diffs
sometimes miss (e.g. identical size but different justify-content).

Run:  python3 tests/visual/card-vs-modal-styles.py [--sample N] [--all]
              [--base URL] [--tolerance 1.5]

Outputs:
  tests/visual/out/styles-report.json
  tests/visual/out/styles-report.md
Exits non-zero when any tile mismatches.
"""

import argparse
import asyncio
import json
import os
import re
from pathlib import Path

from playwright.async_api import Locator, async_playwright

ROOT = Path(__file__).parent
OUT = ROOT / "out"

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

# Style keys we compare. Numeric keys are pixel-tolerant; string keys must match exactly.
NUMERIC_KEYS = [
    "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "rowGap", "columnGap",
]
STRING_KEYS = [
    "display", "flexDirection", "justifyContent", "alignItems",
    "textAlign",
]


def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-") or "item"


async def read_styles(locator: Locator) -> dict:
    """Returns computed styles for the element PLUS its direct parent (wrapper)."""
    return await locator.evaluate(
        """(el, keys) => {
            const [numeric, string] = keys;
            const read = (node) => {
              if (!node) return null;
              const cs = getComputedStyle(node);
              const out = {};
              for (const k of numeric) out[k] = parseFloat(cs[k]) || 0;
              for (const k of string) out[k] = cs[k];
              return out;
            };
            return { self: read(el), parent: read(el.parentElement) };
        }""",
        [NUMERIC_KEYS, STRING_KEYS],
    )


def compare(card: dict, modal: dict, tol: float) -> list[str]:
    reasons: list[str] = []
    for scope in ("self", "parent"):
        a, b = card.get(scope), modal.get(scope)
        if not a or not b:
            continue
        for k in NUMERIC_KEYS:
            delta = abs(a[k] - b[k])
            if delta > tol:
                reasons.append(f"{scope}.{k} Δ={delta:.1f}px (card={a[k]:.1f}, modal={b[k]:.1f})")
        for k in STRING_KEYS:
            if a[k] != b[k]:
                reasons.append(f"{scope}.{k} card={a[k]!r} modal={b[k]!r}")
    return reasons


async def check_category(page, base: str, cat: str, host_attr: str | None,
                         sample: int | None, tol: float, report: list):
    url = f"{base}/elements?category={cat.replace(' ', '%20')}"
    await page.goto(url, wait_until="domcontentloaded")
    try:
        await page.wait_for_selector(TILE_SELECTOR, timeout=10_000)
    except Exception as e:
        report.append({"category": cat, "error": f"no-tiles: {e}"})
        return

    all_tiles = await page.locator(TILE_SELECTOR).all()
    indices = [i for i, t in enumerate(all_tiles)
               if await t.locator("button", has_text="Get code").count() > 0]
    if sample:
        indices = indices[:sample]
    print(f"\n== {cat} ==  {len(indices)} tile(s)")

    for i in indices:
        entry: dict = {"category": cat, "index": i}
        tile = page.locator(TILE_SELECTOR).nth(i)
        btn = tile.locator("button", has_text="Get code").first
        aria = await btn.get_attribute("aria-label") or f"item-{i}"
        name = aria.split("—")[0].strip() if "—" in aria else aria
        entry["name"] = name
        entry["slug"] = slugify(name)

        try:
            await tile.scroll_into_view_if_needed(timeout=3000)
            await tile.hover()
        except Exception as e:
            entry["error"] = f"tile-hover: {e}"
            report.append(entry)
            continue

        # Locate the same "host" inside the tile so we compare like-with-like.
        if host_attr:
            card_host = tile.locator(f"[{host_attr}]").first
        else:
            # Buttons: no host attr — take the actual <button> inside the tile preview area.
            card_host = tile.locator("button").filter(has_not_text="Get code").first

        if await card_host.count() == 0:
            entry["error"] = "card-host-missing"
            report.append(entry)
            continue

        try:
            card_styles = await read_styles(card_host)
        except Exception as e:
            entry["error"] = f"card-read: {e}"
            report.append(entry)
            continue

        try:
            await btn.click(force=True, timeout=3000)
            await page.wait_for_selector("[role=dialog]", timeout=4000)
        except Exception as e:
            entry["error"] = f"modal-open: {e}"
            report.append(entry)
            continue

        if host_attr:
            modal_host = page.locator(f"[role=dialog] [{host_attr}]").first
        else:
            modal_host = page.locator("[role=dialog] .relative.z-10 button").filter(has_not_text="Get code").first

        if await modal_host.count() == 0:
            entry["error"] = "modal-host-missing"
            await page.keyboard.press("Escape")
            report.append(entry)
            continue

        try:
            modal_styles = await read_styles(modal_host)
        except Exception as e:
            entry["error"] = f"modal-read: {e}"
            await page.keyboard.press("Escape")
            report.append(entry)
            continue

        reasons = compare(card_styles, modal_styles, tol)
        entry["card_styles"] = card_styles
        entry["modal_styles"] = modal_styles
        if reasons:
            entry["mismatch"] = reasons
            print(f"  ✗ {name}")
            for r in reasons:
                print(f"     - {r}")
        else:
            print(f"  ✓ {name}")
        report.append(entry)

        await page.keyboard.press("Escape")
        try:
            await page.wait_for_selector("[role=dialog]", state="detached", timeout=3000)
        except Exception:
            await page.goto(url, wait_until="domcontentloaded")
            await page.wait_for_selector(TILE_SELECTOR, timeout=10_000)


async def run(base: str, sample: int | None, tol: float) -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    report: list[dict] = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 1800})
        page = await context.new_page()
        for cat, host_attr in CATEGORIES:
            try:
                await check_category(page, base, cat, host_attr, sample, tol, report)
            except Exception as e:
                print(f"  ! {cat}: {e}")
                report.append({"category": cat, "error": f"uncaught: {e}"})
        await browser.close()

    (OUT / "styles-report.json").write_text(json.dumps(report, indent=2))
    checked = [r for r in report if "index" in r]
    bad = [r for r in checked if r.get("mismatch") or r.get("error")]
    lines = [
        "# Card vs Modal — computed-style parity",
        "",
        f"- checked: **{len(checked)}**",
        f"- mismatches / errors: **{len(bad)}**",
        f"- tolerance: **±{tol}px** on padding/gap; strings must match exactly",
        "",
    ]
    if bad:
        lines += ["| Category | Item | Issue |", "|---|---|---|"]
        for m in bad:
            issue = m.get("error") or "; ".join(m.get("mismatch", []))
            lines.append(f"| {m['category']} | {m.get('name','—')} | {issue} |")
    (OUT / "styles-report.md").write_text("\n".join(lines))
    print(f"\nReport: {OUT/'styles-report.md'}  ({len(bad)} issues / {len(checked)} checked)")
    return 1 if bad else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default=os.environ.get("BASE_URL", "http://localhost:8080"))
    ap.add_argument("--sample", type=int, default=3)
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--tolerance", type=float, default=1.5,
                    help="max allowed drift (px) on padding/gap (default 1.5)")
    args = ap.parse_args()
    sample = None if args.all or args.sample == 0 else args.sample
    raise SystemExit(asyncio.run(run(args.base, sample, args.tolerance)))


if __name__ == "__main__":
    main()
