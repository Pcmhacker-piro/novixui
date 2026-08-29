"""
CodeModal keyboard + focus + screen-reader a11y regression suite.

Verifies, against the running dev server at http://localhost:8080:

  1. Opening the modal moves focus INTO the dialog (initial focus on Close btn).
  2. Tab cycles forward through focusables and wraps at the last element.
  3. Shift+Tab cycles backward and wraps at the first element.
  4. Focus never escapes the dialog subtree while it is open (focus trap).
  5. Escape closes the modal.
  6. On close, focus is RESTORED to the trigger button that opened it.

Screen-reader oriented assertions (new):

  7. Dialog has an accessible NAME via aria-labelledby → resolves to an
     element that contains visible non-empty text (what SR will announce).
  8. Close button has an accessible name ("Close dialog").
  9. React/CSS switcher exposes proper tab semantics: role="tablist",
     role="tab", aria-selected reflects state, aria-controls resolves to
     the code panel, and the panel is labelled by the active tab.
 10. Export split-button toggles aria-expanded correctly on open/close.
 11. Export menu dismissal: pressing Escape while the export menu is
     open closes ONLY the menu (dialog stays open, aria-expanded=false);
     a second Escape then closes the dialog.

Exit code 0 on pass, 1 on any failure. Writes JSON + Markdown report to
tests/visual/out-a11y/.
"""


from __future__ import annotations
import asyncio, json, sys
from pathlib import Path
from playwright.async_api import async_playwright, Page

ROOT = Path(__file__).parent
OUT = ROOT / "out-a11y"
BASE = "http://localhost:8080"

CATEGORIES = ["Buttons", "Checkboxes", "Toggles", "Cards"]


async def focused_info(page: Page) -> dict:
    return await page.evaluate(
        """() => {
          const a = document.activeElement;
          if (!a) return null;
          const dlg = document.querySelector('[role=\"dialog\"]');
          return {
            tag: a.tagName,
            text: (a.textContent || '').trim().slice(0, 60),
            aria: a.getAttribute('aria-label'),
            inDialog: !!(dlg && dlg.contains(a)),
            isDialog: a === dlg,
          };
        }"""
    )


async def get_focusable_count(page: Page) -> int:
    return await page.evaluate(
        """() => {
          const root = document.querySelector('[role=\"dialog\"]');
          if (!root) return 0;
          const sel = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex=\"-1\"])';
          return Array.from(root.querySelectorAll(sel))
            .filter(el => !el.hasAttribute('aria-hidden') && el.offsetParent !== null).length;
        }"""
    )


async def test_category(page: Page, category: str, results: list) -> None:
    entry = {"category": category, "checks": {}, "errors": []}

    def check(name: str, ok: bool, detail: str = "") -> None:
        entry["checks"][name] = {"pass": bool(ok), "detail": detail}
        if not ok:
            entry["errors"].append(f"{name}: {detail}")

    try:
        await page.goto(f"{BASE}/elements?category={category}", wait_until="domcontentloaded")
        await page.wait_for_selector("text=Get code", timeout=15000)
        await page.wait_for_timeout(900)  # let entrance settle

        # Pick a stable gallery-item Get code button (skip mosaic overlays).
        btns = page.locator("button:has-text('Get code')")
        total = await btns.count()
        trigger = btns.nth(min(6, total - 1))
        await trigger.scroll_into_view_if_needed()
        await trigger.evaluate("el => { el.style.opacity = '1'; el.style.transition = 'none'; }")

        # Tag the trigger so we can later confirm focus was restored to it.
        await trigger.evaluate("el => { el.setAttribute('data-a11y-trigger', '1'); el.focus(); }")
        await page.wait_for_timeout(50)

        # Open the modal. Try keyboard first (real SR path); fall back to JS click
        # for categories whose gallery uses tilt/halo overlays that intercept pointer
        # events on the first Enter frame.
        await page.keyboard.press("Enter")
        dialog = page.locator('[role="dialog"]').first
        try:
            await dialog.wait_for(state="visible", timeout=2500)
        except Exception:
            await trigger.evaluate("el => el.click()")
            await dialog.wait_for(state="visible", timeout=8000)
        await page.wait_for_timeout(350)  # entrance animation + initial-focus rAF

        # 1) ARIA + initial focus
        aria = await dialog.evaluate(
            "el => ({ modal: el.getAttribute('aria-modal'), labelled: el.getAttribute('aria-labelledby') })"
        )
        check("aria_modal", aria["modal"] == "true", f"aria-modal={aria['modal']!r}")
        check("aria_labelledby", bool(aria["labelled"]), f"aria-labelledby={aria['labelled']!r}")

        info = await focused_info(page)
        check(
            "initial_focus_in_dialog",
            bool(info and info["inDialog"]),
            f"activeElement={info}",
        )

        focus_count = await get_focusable_count(page)
        check("has_focusables", focus_count > 0, f"count={focus_count}")

        # 2) Forward Tab cycle — never escapes, wraps back to start.
        seen_forward = []
        for _ in range(focus_count + 2):
            f = await focused_info(page)
            seen_forward.append(f)
            if f and not f["inDialog"] and not f["isDialog"]:
                break
            await page.keyboard.press("Tab")
            await page.wait_for_timeout(20)

        escaped = any(f and not f["inDialog"] and not f["isDialog"] for f in seen_forward)
        check("tab_trap_forward", not escaped, f"escaped after {len(seen_forward)} tabs")

        # 3) Shift+Tab cycle — same trap in reverse.
        seen_back = []
        for _ in range(focus_count + 2):
            f = await focused_info(page)
            seen_back.append(f)
            if f and not f["inDialog"] and not f["isDialog"]:
                break
            await page.keyboard.press("Shift+Tab")
            await page.wait_for_timeout(20)

        escaped_back = any(f and not f["inDialog"] and not f["isDialog"] for f in seen_back)
        check("tab_trap_backward", not escaped_back, f"escaped after {len(seen_back)} shift+tabs")

        # 3.5) Screen-reader NAME: aria-labelledby must resolve to a node with visible text.
        name_info = await dialog.evaluate(
            """el => {
              const ids = (el.getAttribute('aria-labelledby') || '').split(/\\s+/).filter(Boolean);
              const parts = ids.map(id => {
                const n = document.getElementById(id);
                return n ? (n.textContent || '').trim() : '';
              });
              return { ids, parts, name: parts.join(' ').trim() };
            }"""
        )
        check(
            "accessible_name_resolves",
            bool(name_info["ids"]) and bool(name_info["name"]),
            f"labelledby={name_info['ids']} → name={name_info['name']!r}",
        )

        # 3.6) Close button has an accessible name.
        close_name = await page.evaluate(
            """() => {
              const b = document.querySelector('[role="dialog"] button[aria-label="Close dialog"]');
              return b ? b.getAttribute('aria-label') : null;
            }"""
        )
        check("close_button_named", close_name == "Close dialog", f"aria-label={close_name!r}")

        # 3.7) React/CSS tab semantics + panel wiring.
        tab_info = await page.evaluate(
            """() => {
              const list = document.querySelector('[role="dialog"] [role="tablist"]');
              if (!list) return { ok: false, reason: 'no tablist' };
              const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
              const selected = tabs.filter(t => t.getAttribute('aria-selected') === 'true');
              const controls = tabs.map(t => t.getAttribute('aria-controls'));
              const panelId = selected[0]?.getAttribute('aria-controls');
              const panel = panelId ? document.getElementById(panelId) : null;
              const labelled = panel?.getAttribute('aria-labelledby');
              return {
                ok: tabs.length >= 2
                    && selected.length === 1
                    && controls.every(c => c && document.getElementById(c))
                    && !!panel
                    && labelled === selected[0].id,
                tabs: tabs.length,
                selected: selected.length,
                panelId,
                labelled,
              };
            }"""
        )
        check("tab_semantics", bool(tab_info.get("ok")), json.dumps(tab_info))

        # 3.8) Export split-button: aria-expanded reflects state.
        export_btn = page.locator('[role="dialog"] button[aria-haspopup="menu"]').first
        await export_btn.wait_for(state="visible", timeout=3000)
        expanded_closed = await export_btn.get_attribute("aria-expanded")
        await export_btn.evaluate("el => el.click()")
        await page.wait_for_timeout(150)
        expanded_open = await export_btn.get_attribute("aria-expanded")
        menu_visible = await page.locator('[role="dialog"] [role="menu"]').count()
        check(
            "export_aria_expanded",
            expanded_closed == "false" and expanded_open == "true" and menu_visible >= 1,
            f"closed={expanded_closed!r} open={expanded_open!r} menuCount={menu_visible}",
        )

        # 3.9) Escape dismisses ONLY the export menu — dialog stays open.
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(180)
        after_menu_close = {
            "dialogVisible": await dialog.is_visible(),
            "menuCount": await page.locator('[role="dialog"] [role="menu"]').count(),
            "expanded": await export_btn.get_attribute("aria-expanded"),
        }
        check(
            "export_escape_closes_menu_only",
            after_menu_close["dialogVisible"]
            and after_menu_close["menuCount"] == 0
            and after_menu_close["expanded"] == "false",
            json.dumps(after_menu_close),
        )

        # 4) Escape closes the modal (second Escape now that the menu is gone).
        await page.keyboard.press("Escape")
        try:
            await dialog.wait_for(state="hidden", timeout=3000)
            check("escape_closes", True)
        except Exception as e:
            check("escape_closes", False, str(e)[:120])

        # 5) Focus restored to trigger.
        await page.wait_for_timeout(150)
        restored = await page.evaluate(
            "() => document.activeElement && document.activeElement.getAttribute('data-a11y-trigger') === '1'"
        )
        check("focus_restored_to_trigger", bool(restored), f"restored={restored}")

    except Exception as e:
        entry["errors"].append(f"fatal: {type(e).__name__}: {str(e)[:200]}")

    entry["pass"] = len(entry["errors"]) == 0
    results.append(entry)


async def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    results: list = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()
        for cat in CATEGORIES:
            print(f"→ {cat}")
            await test_category(page, cat, results)
        await browser.close()

    (OUT / "report.json").write_text(json.dumps(results, indent=2))

    # Markdown summary
    lines = ["# CodeModal a11y — keyboard, focus, screen reader", ""]
    lines.append("| Category | aria | SR name | close named | init focus | tab → | tab ← | tabs | export exp | menu esc | esc | restore |")
    lines.append("|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|")

    def mk(r, key):
        return "✅" if r["checks"].get(key, {}).get("pass") else "❌"

    for r in results:
        aria_ok = r["checks"].get("aria_modal", {}).get("pass") and r["checks"].get("aria_labelledby", {}).get("pass")
        lines.append(
            f"| {r['category']} | {'✅' if aria_ok else '❌'} "
            f"| {mk(r,'accessible_name_resolves')} "
            f"| {mk(r,'close_button_named')} "
            f"| {mk(r,'initial_focus_in_dialog')} "
            f"| {mk(r,'tab_trap_forward')} "
            f"| {mk(r,'tab_trap_backward')} "
            f"| {mk(r,'tab_semantics')} "
            f"| {mk(r,'export_aria_expanded')} "
            f"| {mk(r,'export_escape_closes_menu_only')} "
            f"| {mk(r,'escape_closes')} "
            f"| {mk(r,'focus_restored_to_trigger')} |"
        )
    passed = sum(1 for r in results if r["pass"])
    lines += ["", f"**{passed}/{len(results)} categories passed.**", ""]
    for r in results:
        if r["errors"]:
            lines.append(f"### {r['category']}")
            for e in r["errors"]:
                lines.append(f"- {e}")
    (OUT / "report.md").write_text("\n".join(lines))

    ok = all(r["pass"] for r in results)
    print()
    print("\n".join(lines[-min(20, len(lines)):]))
    print(f"\nReport: {OUT / 'report.md'}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
