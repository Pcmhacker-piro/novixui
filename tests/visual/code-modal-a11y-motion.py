"""
Get code button + CodeModal a11y assertions across BOTH motion modes.

For each motion preference in {'no-preference', 'reduce'} and each gallery
category, this suite verifies the minimum contract from
docs/components/CODE_MODAL_A11Y.md:

  A. Get code TRIGGER
     - Is a real <button type="button"> (not a div with onClick).
     - Has an accessible name (visible text or aria-label).
     - Is reachable by keyboard focus.

  B. Dialog NAME
     - role="dialog", aria-modal="true".
     - aria-labelledby resolves to an element with non-empty visible text
       (this is what a screen reader announces on open).

  C. Focus ON OPEN
     - Within ~500ms of opening, document.activeElement is inside the
       dialog subtree (initial focus contract; Close button is the target
       but any in-dialog focusable satisfies the trap invariant).

  D. Escape CLOSES
     - Pressing Escape (with no menu open) removes the dialog from the DOM
       and restores focus to the originating trigger.

Both motion modes must pass every assertion. Writes JSON + Markdown report
to tests/visual/out-a11y-motion/.

Run:
  python3 tests/visual/code-modal-a11y-motion.py
Exit 0 on pass, 1 on any failure.
"""

from __future__ import annotations
import asyncio, json, sys
from pathlib import Path
from playwright.async_api import async_playwright, Page, BrowserContext

ROOT = Path(__file__).parent
OUT = ROOT / "out-a11y-motion"
OUT.mkdir(parents=True, exist_ok=True)
BASE = "http://localhost:8080"

CATEGORIES = ["Buttons", "Checkboxes", "Cards"]
MOTION_MODES = ["no-preference", "reduce"]


async def open_modal(page: Page):
    """Return (trigger_locator, dialog_locator) after opening a modal."""
    await page.wait_for_selector("text=Get code", timeout=15000)
    await page.wait_for_timeout(600)
    btns = page.locator("button:has-text('Get code')")
    total = await btns.count()
    if total == 0:
        raise RuntimeError("no Get code buttons on page")
    trigger = btns.nth(min(6, total - 1))
    await trigger.scroll_into_view_if_needed()
    await trigger.evaluate(
        "el => { el.style.opacity = '1'; el.style.transition = 'none';"
        " el.setAttribute('data-a11y-trigger', '1'); el.focus(); }"
    )
    await page.wait_for_timeout(40)
    await page.keyboard.press("Enter")
    dialog = page.locator('[role="dialog"]').first
    try:
        await dialog.wait_for(state="visible", timeout=2500)
    except Exception:
        await trigger.evaluate("el => el.click()")
        await dialog.wait_for(state="visible", timeout=8000)
    # Reduced-motion collapses entrance to opacity-only, but keep a small
    # settle window so the initial-focus RAF retry loop can commit.
    await page.wait_for_timeout(500)
    return trigger, dialog


async def assert_trigger(page: Page, check) -> None:
    trigger_info = await page.evaluate(
        """() => {
          const b = document.querySelector('button[data-a11y-trigger="1"]');
          if (!b) return null;
          const name = (b.getAttribute('aria-label') || b.textContent || '').trim();
          return {
            tag: b.tagName,
            type: b.getAttribute('type'),
            name,
            tabbable: b.tabIndex >= 0 && !b.disabled,
          };
        }"""
    )
    check("trigger_is_button", trigger_info and trigger_info["tag"] == "BUTTON",
          f"tag={trigger_info and trigger_info['tag']}")
    check("trigger_type_button", trigger_info and trigger_info["type"] == "button",
          f"type={trigger_info and trigger_info['type']}")
    check("trigger_has_name", bool(trigger_info and trigger_info["name"]),
          f"name={trigger_info and trigger_info['name']!r}")
    check("trigger_keyboard_reachable", bool(trigger_info and trigger_info["tabbable"]),
          f"tabbable={trigger_info and trigger_info['tabbable']}")


async def assert_dialog_name(dialog, check) -> None:
    info = await dialog.evaluate(
        """el => {
          const role = el.getAttribute('role');
          const modal = el.getAttribute('aria-modal');
          const ids = (el.getAttribute('aria-labelledby') || '').split(/\\s+/).filter(Boolean);
          const parts = ids.map(id => {
            const n = document.getElementById(id);
            return n ? (n.textContent || '').trim() : '';
          });
          return { role, modal, ids, name: parts.join(' ').trim() };
        }"""
    )
    check("dialog_role", info["role"] == "dialog", f"role={info['role']!r}")
    check("dialog_aria_modal", info["modal"] == "true", f"aria-modal={info['modal']!r}")
    check("dialog_labelledby_resolves", bool(info["ids"]) and bool(info["name"]),
          f"ids={info['ids']} name={info['name']!r}")


async def assert_focus_on_open(page: Page, check) -> None:
    focus_info = await page.evaluate(
        """() => {
          const a = document.activeElement;
          const dlg = document.querySelector('[role="dialog"]');
          if (!a || !dlg) return { inDialog: false };
          return {
            inDialog: dlg.contains(a),
            tag: a.tagName,
            ariaLabel: a.getAttribute('aria-label'),
          };
        }"""
    )
    check("focus_moved_into_dialog", bool(focus_info and focus_info["inDialog"]),
          f"activeElement={focus_info}")


async def assert_escape_closes(page: Page, check) -> None:
    await page.keyboard.press("Escape")
    # Allow exit animation; reduced-motion is near-instant, default is ~250ms.
    await page.wait_for_timeout(600)
    still_open = await page.evaluate(
        "() => !!document.querySelector('[role=\"dialog\"]')"
    )
    check("escape_closes_dialog", not still_open, f"dialog_present={still_open}")

    restored = await page.evaluate(
        """() => {
          const t = document.querySelector('button[data-a11y-trigger="1"]');
          return { restored: !!t && document.activeElement === t };
        }"""
    )
    check("focus_restored_to_trigger", bool(restored["restored"]),
          f"restored={restored['restored']}")


async def run_case(context: BrowserContext, category: str, motion: str, results: list) -> None:
    entry = {"category": category, "motion": motion, "checks": {}, "errors": []}

    def check(name: str, ok: bool, detail: str = "") -> None:
        entry["checks"][name] = {"pass": bool(ok), "detail": detail}
        if not ok:
            entry["errors"].append(f"{name}: {detail}")

    page = await context.new_page()
    try:
        await page.emulate_media(reduced_motion=motion)  # type: ignore[arg-type]
        await page.goto(f"{BASE}/elements?category={category}", wait_until="domcontentloaded")
        try:
            _, dialog = await open_modal(page)
        except Exception as e:
            check("modal_opens", False, f"open failed: {e}")
            results.append(entry)
            return
        check("modal_opens", True, "")

        await assert_trigger(page, check)
        await assert_dialog_name(dialog, check)
        await assert_focus_on_open(page, check)
        await assert_escape_closes(page, check)
    finally:
        await page.close()
        results.append(entry)


def write_report(results: list) -> tuple[int, int]:
    (OUT / "results.json").write_text(json.dumps(results, indent=2))
    total = passed = 0
    lines = ["# CodeModal a11y — motion-mode matrix", ""]
    for r in results:
        checks = r["checks"]
        c_pass = sum(1 for v in checks.values() if v["pass"])
        c_total = len(checks)
        total += c_total
        passed += c_pass
        status = "PASS" if c_pass == c_total else "FAIL"
        lines.append(f"## {r['category']} · motion={r['motion']} — {status} ({c_pass}/{c_total})")
        for name, v in checks.items():
            mark = "✓" if v["pass"] else "✗"
            detail = f" — {v['detail']}" if v["detail"] else ""
            lines.append(f"- {mark} `{name}`{detail}")
        lines.append("")
    lines.insert(1, f"Totals: **{passed}/{total}** assertions passed across "
                    f"{len(results)} cases.\n")
    (OUT / "report.md").write_text("\n".join(lines))
    return passed, total


async def main() -> int:
    results: list = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        try:
            for motion in MOTION_MODES:
                context = await browser.new_context(viewport={"width": 1280, "height": 1800})
                try:
                    for cat in CATEGORIES:
                        await run_case(context, cat, motion, results)
                finally:
                    await context.close()
        finally:
            await browser.close()

    passed, total = write_report(results)
    any_fail = any(r["errors"] for r in results)
    print(f"[a11y-motion] {passed}/{total} assertions passed "
          f"({len(results)} cases). Report: {OUT / 'report.md'}")
    return 1 if any_fail else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
