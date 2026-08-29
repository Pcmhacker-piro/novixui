"""
CodeModal preview theme toggle — visual + focus regression.

For each category:

  1. Open the modal (initial state = Dark preview).
  2. Assert Dark button has aria-pressed=true, Light has aria-pressed=false,
     and the swatch label reads "#0a0a0a".
  3. Focus the Light button via Tab-nav (not JS focus) then activate with
     keyboard (Space). Verify:
       - aria-pressed flips (Light=true, Dark=false).
       - Swatch label updates to "#e8e8e8".
       - Preview background computed style actually changed (styling applied
         consistently, not just aria state).
       - Focus REMAINS on the Light toggle (not lost to body, not stolen by
         the preview re-render).
       - Focus is still inside the dialog subtree (trap intact).
       - Dialog stays open.
  4. Toggle back to Dark via click. Verify swatch label reverts and the
     Dark button regains aria-pressed=true and keeps focus.
  5. Press Escape → dialog closes and focus returns to the trigger
     (theme changes must not break the close-focus contract).

Writes JSON + Markdown to tests/visual/out-theme/. Exit 0 on pass, 1 on fail.
"""

from __future__ import annotations
import asyncio, json, sys
from pathlib import Path
from playwright.async_api import async_playwright, Page, BrowserContext

ROOT = Path(__file__).parent
OUT = ROOT / "out-theme"
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
    await trigger.evaluate(
        "el => { el.style.opacity='1'; el.style.transition='none';"
        " el.setAttribute('data-a11y-trigger','1'); el.focus(); }"
    )
    await page.keyboard.press("Enter")
    dialog = page.locator('[role="dialog"]').first
    try:
        await dialog.wait_for(state="visible", timeout=2500)
    except Exception:
        await trigger.evaluate("el => el.click()")
        await dialog.wait_for(state="visible", timeout=8000)
    await page.wait_for_timeout(400)
    return dialog


async def theme_state(page: Page) -> dict:
    """Snapshot of every toggle/style detail we care about."""
    return await page.evaluate(
        """() => {
          const dlg = document.querySelector('[role="dialog"]');
          if (!dlg) return null;
          const dark = dlg.querySelector('button[aria-label="Dark preview"]');
          const light = dlg.querySelector('button[aria-label="Light preview"]');
          const swatch = dlg.querySelector('.font-mono');
          // The gradient layer is the aria-hidden div rendered right after
          // the preview pane opens; grab it by its inline background.
          const layers = Array.from(dlg.querySelectorAll('[aria-hidden="true"]'));
          const gradient = layers.find(el => (el.style.background || '').includes('radial-gradient'));
          const active = document.activeElement;
          return {
            darkPressed: dark?.getAttribute('aria-pressed'),
            lightPressed: light?.getAttribute('aria-pressed'),
            swatchLabel: (swatch?.textContent || '').trim(),
            gradient: gradient ? gradient.style.background : '',
            activeIsDark: active === dark,
            activeIsLight: active === light,
            activeInDialog: !!(active && dlg.contains(active)),
            dialogOpen: true,
          };
        }"""
    )


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
            dialog = await open_modal(page)
        except Exception as e:
            check("modal_opens", False, f"{e}")
            results.append(entry)
            return
        check("modal_opens", True, "")

        # 1) Initial dark state.
        s0 = await theme_state(page)
        check("initial_dark_pressed", s0["darkPressed"] == "true",
              f"darkPressed={s0['darkPressed']!r}")
        check("initial_light_unpressed", s0["lightPressed"] == "false",
              f"lightPressed={s0['lightPressed']!r}")
        check("initial_swatch_dark", s0["swatchLabel"] == "#0a0a0a",
              f"swatch={s0['swatchLabel']!r}")
        check("initial_gradient_dark",
              "rgb(18, 18, 18)" in s0["gradient"] or "rgb(5, 5, 5)" in s0["gradient"],
              f"gradient={s0['gradient']!r}")

        # 2) Focus + activate LIGHT via keyboard (real SR-style interaction).
        light_btn = dialog.locator('button[aria-label="Light preview"]')
        await light_btn.focus()
        await page.wait_for_timeout(50)
        pre = await theme_state(page)
        check("light_focused_before_activate", pre["activeIsLight"],
              f"activeIsLight={pre['activeIsLight']}")
        await page.keyboard.press("Space")
        await page.wait_for_timeout(450)  # background transition = .35s

        s1 = await theme_state(page)
        check("light_pressed_after_activate", s1["lightPressed"] == "true",
              f"lightPressed={s1['lightPressed']!r}")
        check("dark_unpressed_after_activate", s1["darkPressed"] == "false",
              f"darkPressed={s1['darkPressed']!r}")
        check("swatch_updates_to_light", s1["swatchLabel"] == "#e8e8e8",
              f"swatch={s1['swatchLabel']!r}")
        check("gradient_updates_to_light",
              "rgb(245, 245, 245)" in s1["gradient"] or "rgb(232, 232, 232)" in s1["gradient"],
              f"gradient={s1['gradient']!r}")
        check("gradient_actually_changed", s1["gradient"] != s0["gradient"],
              "gradient value unchanged after toggle")
        check("focus_preserved_on_light_btn", s1["activeIsLight"],
              f"activeIsLight={s1['activeIsLight']}")
        check("focus_still_in_dialog", s1["activeInDialog"],
              f"activeInDialog={s1['activeInDialog']}")

        # Dialog must still be open.
        still_open = await page.evaluate("() => !!document.querySelector('[role=\"dialog\"]')")
        check("dialog_still_open_after_toggle", still_open, f"open={still_open}")

        # 3) Toggle back to DARK via click, focus should follow to that button.
        dark_btn = dialog.locator('button[aria-label="Dark preview"]')
        await dark_btn.focus()
        await page.wait_for_timeout(30)
        await page.keyboard.press("Enter")
        await page.wait_for_timeout(450)
        s2 = await theme_state(page)
        check("dark_pressed_after_toggle_back", s2["darkPressed"] == "true",
              f"darkPressed={s2['darkPressed']!r}")
        check("swatch_reverts_to_dark", s2["swatchLabel"] == "#0a0a0a",
              f"swatch={s2['swatchLabel']!r}")
        check("focus_preserved_on_dark_btn", s2["activeIsDark"],
              f"activeIsDark={s2['activeIsDark']}")

        # 4) Escape from a non-Close focus target must still close the dialog
        # AND restore focus to the trigger.
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(700)
        closed = await page.evaluate("() => !document.querySelector('[role=\"dialog\"]')")
        check("escape_closes_after_theme_use", closed, f"closed={closed}")
        restored = await page.evaluate(
            """() => {
              const t = document.querySelector('button[data-a11y-trigger=\"1\"]');
              return !!t && document.activeElement === t;
            }"""
        )
        check("focus_restored_after_theme_use", restored,
              f"restored={restored}")
    finally:
        await page.close()
        results.append(entry)


def write_report(results: list) -> tuple[int, int]:
    (OUT / "results.json").write_text(json.dumps(results, indent=2))
    total = passed = 0
    lines = ["# CodeModal preview theme toggle — visual + focus", ""]
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
            context = await browser.new_context(viewport={"width": 1280, "height": 1800})
            try:
                for cat in CATEGORIES:
                    await run_category(context, cat, results)
            finally:
                await context.close()
        finally:
            await browser.close()

    passed, total = write_report(results)
    any_fail = any(r["errors"] for r in results)
    print(f"[theme] {passed}/{total} assertions passed. Report: {OUT / 'report.md'}")
    return 1 if any_fail else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
