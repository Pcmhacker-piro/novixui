"""
Copy-parity check for every docs code block.

For each /docs route:
  - Wait for hydration.
  - Find every code-block copy control (aria-label "Copy code" or "Copy command").
  - Locate the associated rendered snippet (the sibling <pre><code> for CodeBlock,
    or the inline <code> command for CommandChip / Terminal blocks).
  - Click the copy button, then read navigator.clipboard.readText().
  - Fail if the clipboard text does not exactly equal the rendered text.

Run: python3 tests/integration/docs-copy-parity.py
Assumes dev server on http://localhost:8080.
"""

import asyncio
import json
import sys
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).parent
OUT = ROOT / "out-docs-copy"
OUT.mkdir(exist_ok=True)

BASE = "http://localhost:8080"

# Reuse the route list from docs-hydration.py so the two suites stay in sync.
_HYDRATION = (ROOT / "docs-hydration.py").read_text()
_start = _HYDRATION.index("ROUTES = [")
_end = _HYDRATION.index("]", _start) + 1
ROUTES = eval(_HYDRATION[_start + len("ROUTES = ") : _end])


# Script executed in the page: for every copy button, resolve the associated
# expected text from the DOM. Returns a list of { index, label, expected, kind }.
COLLECT_JS = r"""
() => {
  const buttons = Array.from(
    document.querySelectorAll(
      'button[aria-label="Copy code"], button[aria-label="Copy command"], button[aria-label="Copy to clipboard"], button[aria-label^="Copy"]'
    )
  );
  buttons.forEach((b, i) => b.setAttribute("data-copy-test-id", String(i)));
  return buttons.map((b, i) => ({ index: i, label: b.getAttribute("aria-label") || "" }));
}
"""

# Resolve the expected snippet text for a single copy button. Runs in-page
# each time so it can re-read after we click a "Code" tab to reveal source.
EXTRACT_JS = r"""
(id) => {
  const norm = (s) => (s ?? "").replace(/\r\n/g, "\n");
  const btn = document.querySelector(`button[data-copy-test-id="${id}"]`);
  if (!btn) return { expected: null, kind: "missing-button" };

  // Extract from a <pre><code>: join per-line <div>s with newlines and skip
  // aria-hidden gutter (line numbers, diff markers, terminal prompt).
  const extractPre = (codeEl) => {
    const lineDivs = codeEl.querySelectorAll(":scope > div");
    if (lineDivs.length === 0) return norm(codeEl.textContent);
    const lines = [];
    lineDivs.forEach((div) => {
      let text = "";
      div.childNodes.forEach((child) => {
        if (child.nodeType === 1 && child.getAttribute("aria-hidden") === "true") return;
        text += child.textContent ?? "";
      });
      // The regex highlighter emits &nbsp; for empty lines; treat lone NBSP as empty.
      if (text === "\u00a0") text = "";
      lines.push(text);
    });
    return norm(lines.join("\n"));
  };

  // 1. Preview / Snippet: shells built on `nova-card-surface`.
  //    - Preview has a role="tablist" and hides source until the "Code" tab is clicked.
  //    - Snippet is a one-line copyable strip with an inline <code>.
  const previewShell = btn.closest("[class*='nova-card-surface']");
  if (previewShell) {
    const hasTablist = !!previewShell.querySelector('[role="tablist"]');
    const codeEl = previewShell.querySelector("pre code");
    if (codeEl) return { expected: extractPre(codeEl), kind: "preview-code" };
    if (hasTablist) return { expected: null, kind: "preview-code-hidden" };
    const inline = previewShell.querySelector("code");
    if (inline) return { expected: norm(inline.textContent), kind: "snippet" };
    return { expected: null, kind: "preview-empty" };
  }



  // 2. CodeBlock / Terminal / DiffBlock: wrapper is the nearest .group ancestor
  //    that also contains a <pre><code>.
  let wrapper = btn.parentElement;
  while (wrapper && wrapper !== document.body) {
    const codeEl = wrapper.querySelector(":scope pre code");
    if (codeEl) return { expected: extractPre(codeEl), kind: "codeblock" };
    wrapper = wrapper.parentElement;
  }

  // 3. CommandChip: the button itself contains the command text as a <span>.
  //    Structure: <button><span>$</span><span>{cmd}</span><span>{icon}</span></button>
  const spans = btn.querySelectorAll(":scope > span");
  if (spans.length >= 2) {
    // Second span is the command payload.
    return { expected: norm(spans[1].textContent), kind: "commandchip" };
  }

  return { expected: null, kind: "unresolved" };
}
"""

# Reveal a hidden code panel by clicking a sibling role="tab" whose label is "Code".
REVEAL_JS = r"""
(id) => {
  const btn = document.querySelector(`button[data-copy-test-id="${id}"]`);
  if (!btn) return false;
  const shell = btn.closest("[class*='nova-card-surface']");
  if (!shell) return false;
  const tabs = shell.querySelectorAll('[role="tab"]');
  for (const t of tabs) {
    if ((t.textContent || "").trim().toLowerCase() === "code") {
      t.click();
      return true;
    }
  }
  return false;
}
"""


async def check_route(context, page, route):
    url = BASE + route
    errors = []
    await page.goto(url, wait_until="networkidle")
    # Give React a tick to hydrate copy handlers.
    await page.wait_for_timeout(300)

    buttons = await page.evaluate(COLLECT_JS)
    if not buttons:
        return {"route": route, "checked": 0, "errors": []}

    for entry in buttons:
        idx = entry["index"]
        label = entry["label"]

        # Resolve expected snippet; reveal hidden code panels if needed.
        info = await page.evaluate(EXTRACT_JS, idx)
        if info["kind"] == "preview-code-hidden":
            await page.evaluate(REVEAL_JS, idx)
            await page.wait_for_timeout(120)
            info = await page.evaluate(EXTRACT_JS, idx)

        expected = info["expected"]
        if expected is None:
            errors.append(f"[{route}] btn#{idx} ({label}): could not resolve expected text ({info['kind']})")
            continue


        selector = f'button[data-copy-test-id="{idx}"]'
        # Reset clipboard to a sentinel we can detect if the click didn't fire.
        await page.evaluate("navigator.clipboard.writeText('__NOVIX_SENTINEL__')")
        try:
            await page.locator(selector).scroll_into_view_if_needed(timeout=2000)
            await page.locator(selector).click(timeout=2000)
        except Exception as ex:
            errors.append(f"[{route}] btn#{idx}: click failed: {ex}")
            continue

        # Wait for the writeText to resolve. Retry once on clipboard-unchanged
        # to guard against setTimeout races between adjacent Snippet buttons.
        actual = None
        for attempt in range(2):
            await page.wait_for_timeout(120 if attempt == 0 else 300)
            try:
                actual = await page.evaluate("navigator.clipboard.readText()")
            except Exception as ex:
                errors.append(f"[{route}] btn#{idx}: readText failed: {ex}")
                actual = None
                break
            if actual != "__NOVIX_SENTINEL__":
                break
            # Re-click and try once more.
            try:
                await page.locator(selector).click(timeout=2000)
            except Exception:
                pass

        if actual is None:
            continue
        if actual == "__NOVIX_SENTINEL__":
            errors.append(f"[{route}] btn#{idx} ({label}): clipboard unchanged after click")
            continue


        # Normalize CRLF only; preserve everything else exactly.
        actual_n = actual.replace("\r\n", "\n")
        expected_n = expected.replace("\r\n", "\n")
        if actual_n != expected_n:
            diff_path = OUT / f"diff_{route.strip('/').replace('/', '_')}_{idx}.txt"
            diff_path.write_text(
                f"URL: {url}\nLABEL: {label}\nKIND: {info['kind']}\n\n--- EXPECTED (rendered) ---\n{expected_n}\n\n--- ACTUAL (clipboard) ---\n{actual_n}\n"
            )
            errors.append(
                f"[{route}] btn#{idx} ({label}): mismatch "
                f"(expected {len(expected_n)} chars, got {len(actual_n)}) → {diff_path.name}"
            )


    return {"route": route, "checked": len(buttons), "errors": errors}


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 1800},
            permissions=["clipboard-read", "clipboard-write"],
        )
        await context.grant_permissions(["clipboard-read", "clipboard-write"], origin=BASE)
        page = await context.new_page()

        total_checked = 0
        all_errors = []
        for route in ROUTES:
            try:
                result = await check_route(context, page, route)
            except Exception as ex:
                all_errors.append(f"[{route}] route crashed: {ex}")
                continue
            total_checked += result["checked"]
            if result["errors"]:
                all_errors.extend(result["errors"])
            print(f"  {route}: {result['checked']} copy buttons, {len(result['errors'])} errors")

        await browser.close()

        summary = {
            "routes": len(ROUTES),
            "copy_buttons_checked": total_checked,
            "errors": all_errors,
        }
        (OUT / "summary.json").write_text(json.dumps(summary, indent=2))
        print(f"\nChecked {total_checked} copy buttons across {len(ROUTES)} routes.")
        if all_errors:
            print(f"\n✖ {len(all_errors)} mismatch(es):")
            for e in all_errors[:30]:
                print("   " + e)
            sys.exit(1)
        print("\n✓ All copy buttons produce clipboard text that matches the rendered snippet.")


if __name__ == "__main__":
    asyncio.run(main())
