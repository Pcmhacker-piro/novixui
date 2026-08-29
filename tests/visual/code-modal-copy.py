"""
CodeModal Copy button — clipboard fidelity + success state.

For each category, opens the modal, reads the exact text rendered in the code
panel (role="tabpanel"), clicks the Copy button, then verifies:

  1. navigator.clipboard.readText() === panel text (exact, char-for-char).
  2. Copy button aria-label flips to the "copied" state.
  3. Visible label switches "Copy" → "Copied".
  4. After ~1500ms it reverts to the idle state (no stuck UI).
  5. Switching the framework tab and re-copying yields the NEW panel text
     (guards against a stale-closure regression on the copy handler).

Writes JSON + Markdown to tests/visual/out-copy/. Exit 0 on pass, 1 on any fail.
"""

from __future__ import annotations
import asyncio, json, sys
from pathlib import Path
from playwright.async_api import async_playwright, Page, BrowserContext

ROOT = Path(__file__).parent
OUT = ROOT / "out-copy"
OUT.mkdir(parents=True, exist_ok=True)
BASE = "http://localhost:8080"
CATEGORIES = ["Buttons", "Checkboxes", "Cards"]


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


async def panel_text(page: Page) -> str:
    return await page.evaluate(
        """() => {
          const panel = document.getElementById('nova-code-panel');
          if (!panel) return '';
          const code = panel.querySelector('code') || panel;
          return code.textContent || '';
        }"""
    )


async def copy_button(page: Page):
    return page.locator(
        '[role="dialog"] button[aria-label="Copy code to clipboard"], '
        '[role="dialog"] button[aria-label="Code copied to clipboard"]'
    ).first


async def read_clipboard(page: Page) -> str:
    return await page.evaluate("() => navigator.clipboard.readText()")


async def run_category(context: BrowserContext, category: str, results: list) -> None:
    entry = {"category": category, "checks": {}, "errors": []}

    def check(name: str, ok: bool, detail: str = "") -> None:
        entry["checks"][name] = {"pass": bool(ok), "detail": detail}
        if not ok:
            entry["errors"].append(f"{name}: {detail}")

    page = await context.new_page()
    try:
        await page.goto(f"{BASE}/elements?category={category}", wait_until="domcontentloaded")
        try:
            await open_modal(page)
        except Exception as e:
            check("modal_opens", False, f"{e}")
            results.append(entry)
            return
        check("modal_opens", True, "")

        expected = await panel_text(page)
        check("panel_has_text", len(expected) > 0, f"len={len(expected)}")

        btn = await copy_button(page)
        await btn.wait_for(state="visible", timeout=5000)

        # Idle-state assertions.
        idle_label = await btn.get_attribute("aria-label")
        idle_text = (await btn.inner_text()).strip()
        check("idle_aria_label", idle_label == "Copy code to clipboard",
              f"aria-label={idle_label!r}")
        check("idle_visible_text", "Copy" in idle_text and "Copied" not in idle_text,
              f"text={idle_text!r}")

        await btn.evaluate("el => el.click()")
        await page.wait_for_timeout(150)

        # Success-state assertions.
        active_label = await btn.get_attribute("aria-label")
        active_text = (await btn.inner_text()).strip()
        check("success_aria_label", active_label == "Code copied to clipboard",
              f"aria-label={active_label!r}")
        check("success_visible_text", "Copied" in active_text,
              f"text={active_text!r}")

        # Clipboard fidelity — exact match.
        clip = await read_clipboard(page)
        check("clipboard_matches_panel", clip == expected,
              f"len(clip)={len(clip)} len(panel)={len(expected)} "
              f"equal={clip == expected}")

        # Revert-to-idle.
        await page.wait_for_timeout(1700)
        final_label = await btn.get_attribute("aria-label")
        check("reverts_to_idle", final_label == "Copy code to clipboard",
              f"aria-label={final_label!r}")

        # Tab-switch freshness: switch to the other framework tab (if any) and
        # verify the next copy sends the NEW panel text.
        tabs = page.locator('[role="dialog"] [role="tab"]')
        n_tabs = await tabs.count()
        if n_tabs >= 2:
            other = tabs.nth(1)
            selected = await other.get_attribute("aria-selected")
            if selected != "true":
                await other.click()
                await page.wait_for_timeout(200)
            new_expected = await panel_text(page)
            btn2 = await copy_button(page)
            await btn2.evaluate("el => el.click()")
            await page.wait_for_timeout(120)
            clip2 = await read_clipboard(page)
            check(
                "clipboard_updates_after_tab_switch",
                clip2 == new_expected and clip2 != expected,
                f"changed={clip2 != expected} matches_new={clip2 == new_expected}",
            )
        else:
            entry["checks"]["clipboard_updates_after_tab_switch"] = {
                "pass": True, "detail": "single framework tab; skipped"
            }
    finally:
        await page.close()
        results.append(entry)


def write_report(results: list) -> tuple[int, int]:
    (OUT / "results.json").write_text(json.dumps(results, indent=2))
    total = passed = 0
    lines = ["# CodeModal Copy — clipboard + success state", ""]
    for r in results:
        checks = r["checks"]
        c_pass = sum(1 for v in checks.values() if v["pass"])
        c_total = len(checks)
        total += c_total
        passed += c_pass
        status = "PASS" if c_pass == c_total else "FAIL"
        lines.append(f"## {r['category']} — {status} ({c_pass}/{c_total})")
        for name, v in checks.items():
            mark = "✓" if v["pass"] else "✗"
            detail = f" — {v['detail']}" if v["detail"] else ""
            lines.append(f"- {mark} `{name}`{detail}")
        lines.append("")
    lines.insert(1, f"Totals: **{passed}/{total}** assertions across {len(results)} categories.\n")
    (OUT / "report.md").write_text("\n".join(lines))
    return passed, total


async def main() -> int:
    results: list = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        try:
            context = await browser.new_context(
                viewport={"width": 1280, "height": 1800},
                permissions=["clipboard-read", "clipboard-write"],
            )
            try:
                for cat in CATEGORIES:
                    await run_category(context, cat, results)
            finally:
                await context.close()
        finally:
            await browser.close()

    passed, total = write_report(results)
    any_fail = any(r["errors"] for r in results)
    print(f"[copy] {passed}/{total} assertions passed. Report: {OUT / 'report.md'}")
    return 1 if any_fail else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
