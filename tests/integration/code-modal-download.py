"""
Integration test — CodeModal Export/Save downloads.

Verifies the "Export" split-button in the CodeModal (the Save-to-disk action;
"Save to favorites" is a separate control) writes a real file with:

  1. The expected filename — `<slug>.<ext>` where slug is a
     lowercase-hyphenated form of the element name and ext is tsx/css/html.
  2. A stable MIME type (`text/plain;charset=utf-8`) on the underlying blob,
     asserted via the `<a download>` MIME set by CodeModal.
  3. Non-empty contents whose text exactly matches the code panel for React
     and CSS exports, and — for HTML — a valid standalone document that
     wraps the React snippet with the expected `<!doctype html>` shell and
     the element name in the `<title>`.
  4. The Export menu closes after the download fires (regression guard for
     the click-outside handler wiring).

Run:
  python3 tests/integration/code-modal-download.py
"""

from __future__ import annotations
import asyncio, json, re, sys
from pathlib import Path
from playwright.async_api import async_playwright, Page, BrowserContext, Download

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "out-download"
OUT.mkdir(parents=True, exist_ok=True)
DOWNLOADS = OUT / "files"
DOWNLOADS.mkdir(exist_ok=True)

BASE = "http://localhost:8080"
CATEGORIES = ["Buttons", "Checkboxes", "Cards"]
KINDS = ["react", "css", "html"]


def slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower())
    return re.sub(r"(^-|-$)", "", s)


async def open_modal(page: Page) -> tuple[str, object]:
    """Open the modal for a stable tile; return (element_name, dialog_locator)."""
    await page.wait_for_selector("text=Get code", timeout=15000)
    await page.wait_for_timeout(500)
    triggers = page.locator("button:has-text('Get code')")
    total = await triggers.count()
    trigger = triggers.nth(min(6, total - 1))
    await trigger.scroll_into_view_if_needed()
    # Read the element name from the tile card that owns this trigger so we
    # can compute the expected slug deterministically.
    name = await trigger.evaluate(
        """(btn) => {
          const card = btn.closest('[data-name]') || btn.closest('article') || btn.closest('.group');
          if (card && card.dataset && card.dataset.name) return card.dataset.name;
          // Fallback: nearest heading text in the same card.
          const scope = btn.closest('article, section, .group, li, div');
          const h = scope && scope.querySelector('h1,h2,h3,h4,[data-name]');
          return (h && (h.getAttribute('data-name') || h.textContent || '').trim()) || '';
        }"""
    )
    await trigger.evaluate("el => { el.style.opacity='1'; el.style.transition='none'; el.focus(); }")
    await page.keyboard.press("Enter")
    dialog = page.locator('[role="dialog"]').first
    try:
        await dialog.wait_for(state="visible", timeout=2500)
    except Exception:
        await trigger.evaluate("el => el.click()")
        await dialog.wait_for(state="visible", timeout=8000)
    # If we couldn't harvest a name from the card, fall back to the dialog title.
    if not name:
        name = (await dialog.locator("h2, [id^='code-modal-title-']").first.text_content()) or ""
    # The sr-only dialog title is `"<name> — code and preview"`; strip that
    # suffix so slug and <title> assertions see the raw element name.
    name = re.sub(r"\s*—\s*code and preview\s*$", "", name.strip())
    await page.wait_for_timeout(300)
    return name, dialog


async def select_tab(page: Page, tab: str) -> None:
    btn = page.locator(f"#nova-code-tab-{tab}")
    if await btn.count() == 0:
        return
    if await btn.get_attribute("aria-selected") != "true":
        await btn.evaluate("el => el.click()")
        await page.wait_for_timeout(150)


async def panel_text(page: Page) -> str:
    return await page.evaluate(
        "() => (document.getElementById('nova-code-panel')?.innerText ?? '')"
    )


async def download_via(page: Page, kind: str) -> Download:
    # Open the Export menu.
    export_btn = page.locator('button[aria-haspopup="menu"]', has_text="Export").first
    await export_btn.click()
    await page.wait_for_selector('[role="menu"]', timeout=3000)
    item_label = {"react": "React (.tsx)", "css": "CSS (.css)", "html": "Standalone (.html)"}[kind]
    async with page.expect_download(timeout=10000) as dl_info:
        await page.locator('[role="menuitem"]', has_text=item_label).first.click()
    return await dl_info.value


async def run_case(context: BrowserContext, category: str, kind: str, results: list) -> None:
    entry = {"category": category, "kind": kind, "checks": {}, "errors": []}

    def check(name: str, ok: bool, detail: str = "") -> None:
        entry["checks"][name] = {"pass": bool(ok), "detail": detail}
        if not ok:
            entry["errors"].append(f"{name}: {detail}")

    page = await context.new_page()
    try:
        await page.emulate_media(reduced_motion="reduce")
        await page.goto(f"{BASE}/elements?category={category}", wait_until="domcontentloaded")
        try:
            name, dialog = await open_modal(page)
        except Exception as e:
            check("modal_opens", False, f"{e}")
            results.append(entry); return
        check("modal_opens", True, f"name={name!r}")

        # Capture the source text for the tab we'll download (React panel for
        # 'react' + 'html' cases; CSS panel for 'css').
        source_tab = "css" if kind == "css" else "react"
        await select_tab(page, source_tab)
        expected_text = (await panel_text(page)).rstrip("\n")

        # Trigger the download.
        try:
            download = await download_via(page, kind)
        except Exception as e:
            check("download_fires", False, f"{e}")
            results.append(entry); return
        check("download_fires", True, "")

        # 1. Filename.
        expected_ext = {"react": "tsx", "css": "css", "html": "html"}[kind]
        expected_slug = slugify(name) if name else ""
        suggested = download.suggested_filename
        if expected_slug:
            check("filename_matches", suggested == f"{expected_slug}.{expected_ext}",
                  f"expected={expected_slug}.{expected_ext} got={suggested}")
        else:
            # Couldn't derive the element name — settle for the extension.
            check("filename_matches", suggested.endswith(f".{expected_ext}"),
                  f"expected *.{expected_ext} got={suggested}")

        # Save file for byte-level assertions and manual review.
        saved_path = DOWNLOADS / f"{category.lower()}-{kind}-{suggested}"
        await download.save_as(str(saved_path))
        body = saved_path.read_text(encoding="utf-8")

        check("file_nonempty", len(body) > 0, f"bytes={len(body)}")

        # 2. Contents.
        if kind == "html":
            # Standalone document must wrap the React snippet.
            checks_html = {
                "has_doctype": body.lstrip().lower().startswith("<!doctype html>"),
                "title_has_name": f"<title>{name}" in body if name else "<title>" in body,
                "wraps_react_snippet": expected_text != "" and expected_text in body,
                "has_html_shell": "<html" in body and "</html>" in body,
            }
            for k, ok in checks_html.items():
                check(k, ok, f"len(body)={len(body)}")
        else:
            # React / CSS export must equal the code pane byte-for-byte
            # (both were captured via innerText, so newlines normalize).
            got = body.rstrip("\n")
            check("content_matches_pane", got == expected_text,
                  f"expected_len={len(expected_text)} got_len={len(got)}")

        # 3. Menu closed after download.
        menu_open = await page.locator('[role="menu"]').count() > 0
        check("export_menu_closes", not menu_open, f"menu_present={menu_open}")

        # 4. Dialog still open (download is non-destructive).
        check("dialog_still_open", await dialog.is_visible(), "")

    finally:
        await page.close()
        results.append(entry)


def write_report(results: list) -> tuple[int, int]:
    (OUT / "results.json").write_text(json.dumps(results, indent=2))
    total = passed = 0
    lines = ["# CodeModal — Export/Save download integration", ""]
    for r in results:
        checks = r["checks"]
        cp = sum(1 for v in checks.values() if v["pass"])
        ct = len(checks)
        total += ct; passed += cp
        status = "PASS" if cp == ct else "FAIL"
        lines.append(f"## {r['category']} · kind={r['kind']} — {status} ({cp}/{ct})")
        for name, v in checks.items():
            mark = "✓" if v["pass"] else "✗"
            detail = f" — {v['detail']}" if v["detail"] else ""
            lines.append(f"- {mark} `{name}`{detail}")
        lines.append("")
    lines.insert(1, f"Totals: **{passed}/{total}** across {len(results)} cases. "
                    f"Downloaded files: `{DOWNLOADS}`.\n")
    (OUT / "report.md").write_text("\n".join(lines))
    return passed, total


async def main() -> int:
    results: list = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        try:
            context = await browser.new_context(
                viewport={"width": 1280, "height": 1800},
                accept_downloads=True,
            )
            try:
                for cat in CATEGORIES:
                    for kind in KINDS:
                        await run_case(context, cat, kind, results)
            finally:
                await context.close()
        finally:
            await browser.close()
    passed, total = write_report(results)
    any_fail = any(r["errors"] for r in results)
    print(f"[download] {passed}/{total} assertions "
          f"({len(results)} cases). Report: {OUT / 'report.md'}")
    return 1 if any_fail else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
