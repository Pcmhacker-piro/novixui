"""
CodeModal code-pane visual regression.

Captures screenshots of the code panel (`#nova-code-panel`) for both source
tabs (React, CSS) across a set of gallery categories. Compares each
capture against the golden baseline in tests/visual/out-code-snap/baseline/.
On the FIRST run (or when a baseline is missing), the current capture is
promoted to the baseline and the assertion passes with detail
"baseline_created".

For each snapshot the suite asserts:

  1. Pixel-diff ratio vs baseline is below CODE_PANE_DIFF_THRESHOLD (0.005 = 0.5%).
     Guards against font, spacing, and line-wrap drift.
  2. Panel `scrollWidth` vs `clientWidth` matches the baseline within ±2px
     (the pane is intentionally horizontally scrollable for long lines;
     this catches unexpected wrap-mode changes, not the existing overflow).
  3. Line count (rendered `<br>`-free textContent split on '\\n') is stable
     vs baseline within ±1 (wrap regressions add many lines at once).
  4. Computed font-family and font-size on the <code> element match the
     baseline exactly (highlighting theme swaps often change these).

Writes JSON + Markdown report and diff PNGs to tests/visual/out-code-snap/.
Exit 0 on pass, 1 on any regression.

Run:
  python3 tests/visual/code-pane-snapshots.py
Refresh baselines:
  rm -rf tests/visual/out-code-snap/baseline && python3 tests/visual/code-pane-snapshots.py
"""

from __future__ import annotations
import asyncio, json, sys
from pathlib import Path
from PIL import Image, ImageChops
from playwright.async_api import async_playwright, Page, BrowserContext

ROOT = Path(__file__).parent
OUT = ROOT / "out-code-snap"
BASELINE = OUT / "baseline"
CURRENT = OUT / "current"
DIFF = OUT / "diff"
for d in (BASELINE, CURRENT, DIFF):
    d.mkdir(parents=True, exist_ok=True)

BASE = "http://localhost:8080"
CATEGORIES = ["Buttons", "Checkboxes", "Cards"]
TABS = ["react", "css"]
THRESHOLD = 0.005  # 0.5% pixel diff budget


async def open_modal(page: Page):
    await page.wait_for_selector("text=Get code", timeout=15000)
    await page.wait_for_timeout(600)
    btns = page.locator("button:has-text('Get code')")
    total = await btns.count()
    trigger = btns.nth(min(6, total - 1))
    await trigger.scroll_into_view_if_needed()
    await trigger.evaluate("el => { el.style.opacity='1'; el.style.transition='none'; el.focus(); }")
    await page.keyboard.press("Enter")
    dialog = page.locator('[role="dialog"]').first
    try:
        await dialog.wait_for(state="visible", timeout=2500)
    except Exception:
        await trigger.evaluate("el => el.click()")
        await dialog.wait_for(state="visible", timeout=8000)
    await page.wait_for_timeout(400)
    return dialog


async def select_tab(page: Page, tab: str) -> None:
    tab_id = f"nova-code-tab-{tab}"
    btn = page.locator(f'#{tab_id}')
    if await btn.count() == 0:
        return
    selected = await btn.get_attribute("aria-selected")
    if selected != "true":
        await btn.evaluate("el => el.click()")
        await page.wait_for_timeout(180)


async def pane_metrics(page: Page) -> dict:
    return await page.evaluate(
        """() => {
          const p = document.getElementById('nova-code-panel');
          if (!p) return null;
          const code = p.querySelector('code') || p;
          const cs = getComputedStyle(code);
          const text = code.textContent || '';
          return {
            scrollWidth: p.scrollWidth,
            clientWidth: p.clientWidth,
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            lineCount: text.split('\\n').length,
          };
        }"""
    )


def pixel_diff_ratio(a: Path, b: Path, diff_out: Path) -> float:
    """Return the fraction of differing pixels; write a diff PNG for review."""
    ia = Image.open(a).convert("RGB")
    ib = Image.open(b).convert("RGB")
    if ia.size != ib.size:
        # Size drift is a hard failure — emit a stacked diff for review.
        w = max(ia.size[0], ib.size[0])
        h = ia.size[1] + ib.size[1]
        stacked = Image.new("RGB", (w, h), (255, 0, 255))
        stacked.paste(ia, (0, 0))
        stacked.paste(ib, (0, ia.size[1]))
        stacked.save(diff_out)
        return 1.0
    diff = ImageChops.difference(ia, ib)
    bbox = diff.getbbox()
    if bbox is None:
        return 0.0
    # Save a red-highlighted diff for humans.
    diff.save(diff_out)
    px = ia.size[0] * ia.size[1]
    changed = sum(1 for p in diff.getdata() if p != (0, 0, 0))
    return changed / px


async def snapshot(context: BrowserContext, category: str, tab: str, results: list) -> None:
    key = f"{category.lower()}-{tab}"
    entry = {"category": category, "tab": tab, "checks": {}, "errors": []}
    appended = False

    def check(name: str, ok: bool, detail: str = "") -> None:
        entry["checks"][name] = {"pass": bool(ok), "detail": detail}
        if not ok:
            entry["errors"].append(f"{name}: {detail}")

    def finish() -> None:
        nonlocal appended
        if not appended:
            results.append(entry)
            appended = True

    page = await context.new_page()
    try:
        await page.emulate_media(reduced_motion="reduce")
        await page.goto(f"{BASE}/elements?category={category}", wait_until="domcontentloaded")
        try:
            dialog = await open_modal(page)
        except Exception as e:
            check("modal_opens", False, f"{e}")
            return
        check("modal_opens", True, "")

        await select_tab(page, tab)
        # Disable caret blink and any lingering transitions for stable pixels.
        await page.add_style_tag(content="* { caret-color: transparent !important; transition: none !important; animation: none !important; }")
        await page.wait_for_timeout(120)

        metrics = await pane_metrics(page)
        check("pane_present", metrics is not None, f"metrics={metrics}")
        if not metrics:
            return

        current_png = CURRENT / f"{key}.png"
        baseline_png = BASELINE / f"{key}.png"
        meta_path = BASELINE / f"{key}.json"
        pane = page.locator("#nova-code-panel")
        await pane.screenshot(path=str(current_png))

        if not baseline_png.exists() or not meta_path.exists():
            # Promote current to baseline; still record metrics.
            current_png.replace(baseline_png)
            meta_path.write_text(json.dumps(metrics, indent=2))
            check("pixel_diff_within_threshold", True, "baseline_created")
            check("line_count_stable", True, f"baseline_created line_count={metrics['lineCount']}")
            check("overflow_ratio_stable", True,
                  f"baseline_created scrollWidth/clientWidth={metrics['scrollWidth']}/{metrics['clientWidth']}")
            check("font_family_stable", True, f"baseline_created font_family={metrics['fontFamily']}")
            check("font_size_stable", True, f"baseline_created font_size={metrics['fontSize']}")
            return

        # Compare against baseline.
        diff_png = DIFF / f"{key}.png"
        ratio = pixel_diff_ratio(baseline_png, current_png, diff_png)
        check("pixel_diff_within_threshold", ratio <= THRESHOLD,
              f"ratio={ratio:.5f} threshold={THRESHOLD} diff={diff_png}")

        base_meta = json.loads(meta_path.read_text())
        check("line_count_stable", abs(base_meta["lineCount"] - metrics["lineCount"]) <= 1,
              f"baseline={base_meta['lineCount']} current={metrics['lineCount']}")
        # Horizontal scrollWidth is allowed but must not drift more than 2px
        # from baseline — catches wrap-mode toggles without flagging the
        # intentional horizontal scroll for long lines.
        check("overflow_ratio_stable",
              abs(base_meta["scrollWidth"] - metrics["scrollWidth"]) <= 2
              and abs(base_meta["clientWidth"] - metrics["clientWidth"]) <= 2,
              f"baseline={base_meta['scrollWidth']}/{base_meta['clientWidth']} "
              f"current={metrics['scrollWidth']}/{metrics['clientWidth']}")
        check("font_family_stable", base_meta["fontFamily"] == metrics["fontFamily"],
              f"baseline={base_meta['fontFamily']!r} current={metrics['fontFamily']!r}")
        check("font_size_stable", base_meta["fontSize"] == metrics["fontSize"],
              f"baseline={base_meta['fontSize']!r} current={metrics['fontSize']!r}")
    finally:
        await page.close()
        finish()


def write_report(results: list) -> tuple[int, int]:
    (OUT / "results.json").write_text(json.dumps(results, indent=2))
    total = passed = 0
    lines = ["# CodeModal code pane — visual regression", ""]
    for r in results:
        checks = r["checks"]
        c_pass = sum(1 for v in checks.values() if v["pass"])
        c_total = len(checks)
        total += c_total
        passed += c_pass
        status = "PASS" if c_pass == c_total else "FAIL"
        lines.append(f"## {r['category']} · tab={r['tab']} — {status} ({c_pass}/{c_total})")
        for name, v in checks.items():
            mark = "✓" if v["pass"] else "✗"
            detail = f" — {v['detail']}" if v["detail"] else ""
            lines.append(f"- {mark} `{name}`{detail}")
        lines.append("")
    lines.insert(1, f"Totals: **{passed}/{total}** assertions across "
                    f"{len(results)} snapshots. Baselines: `{BASELINE}`.\n")
    (OUT / "report.md").write_text("\n".join(lines))
    return passed, total


async def main() -> int:
    results: list = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        try:
            context = await browser.new_context(viewport={"width": 1280, "height": 1800})
            try:
                for cat in CATEGORIES:
                    for tab in TABS:
                        await snapshot(context, cat, tab, results)
            finally:
                await context.close()
        finally:
            await browser.close()
    passed, total = write_report(results)
    any_fail = any(r["errors"] for r in results)
    print(f"[code-snap] {passed}/{total} assertions passed "
          f"({len(results)} snapshots). Report: {OUT / 'report.md'}")
    return 1 if any_fail else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
