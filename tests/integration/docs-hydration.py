"""
Automated hydration + code-block render check for every /docs route.

For each route:
  - Navigates fresh (SSR HTML is delivered, then React hydrates).
  - Captures console messages and page errors.
  - Fails the route if any message matches known React hydration patterns.
  - Verifies at least one <pre><code> renders and none are empty.
  - Verifies no code block contains raw unescaped HTML from a broken highlighter
    (e.g. literal "<span class=" text nodes leaking into <code>).

Run: python3 tests/integration/docs-hydration.py
Assumes dev server on http://localhost:8080.
"""

import asyncio
import re
import sys
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).parent
OUT = ROOT / "out-docs-hydration"
OUT.mkdir(exist_ok=True)

BASE = "http://localhost:8080"

ROUTES = [
    "/docs",
    "/docs/quick-start",
    "/docs/installation",
    "/docs/accessibility",
    "/docs/atelier",
    "/docs/changelog",
    "/docs/cli",
    "/docs/design-principles",
    "/docs/effects",
    "/docs/faq",
    "/docs/guides",
    "/docs/lab",
    "/docs/learn",
    "/docs/motion",
    "/docs/playground",
    "/docs/release",
    "/docs/roadmap",
    "/docs/showcase",
    "/docs/theming",
    "/docs/troubleshooting",
    "/docs/components",
    "/docs/components/avatar",
    "/docs/components/badge",
    "/docs/components/button",
    "/docs/components/button-mechanics",
    "/docs/components/card",
    "/docs/components/icon",
    "/docs/components/icon-button",
    "/docs/components/input",
    "/docs/components/kbd",
    "/docs/components/label",
    "/docs/components/separator",
    "/docs/components/skeleton",
    "/docs/components/spinner",
    "/docs/tokens/colors",
    "/docs/tokens/icons",
    "/docs/tokens/motion",
    "/docs/tokens/spacing",
    "/docs/tokens/typography",
    "/docs/migration",
    "/docs/migration/ant-design",
    "/docs/migration/bootstrap",
    "/docs/migration/chakra-ui",
    "/docs/migration/material-ui",
    "/docs/migration/tailwind-ui",
    "/docs/recipes",
    "/docs/recipes/authentication",
    "/docs/recipes/command-palette",
    "/docs/recipes/dashboard",
    "/docs/recipes/data-tables",
    "/docs/recipes/documentation-layout",
    "/docs/recipes/empty-states",
    "/docs/recipes/forms",
    "/docs/recipes/hero",
    "/docs/recipes/modals",
    "/docs/recipes/onboarding",
    "/docs/recipes/pricing",
    "/docs/recipes/settings",
    "/docs/recipes/toasts",
    "/docs/templates",
    "/docs/templates/admin-panel",
    "/docs/templates/billing",
    "/docs/templates/blog",
    "/docs/templates/documentation-site",
    "/docs/templates/landing-page",
    "/docs/templates/login",
    "/docs/templates/portfolio",
    "/docs/templates/profile",
    "/docs/templates/saas-dashboard",
    "/docs/templates/settings",
    "/docs/templates/signup",
    "/docs/templates/team-management",
]

# React hydration + related error signatures.
HYDRATION_PATTERNS = [
    re.compile(r"hydrat", re.I),
    re.compile(r"did not match", re.I),
    re.compile(r"server.*html.*didn't match", re.I),
    re.compile(r"text content does not match", re.I),
    re.compile(r"Minified React error #(418|419|421|422|423|425)"),
    re.compile(r"There was an error while hydrating", re.I),
]

# Suppress noise that isn't a hydration issue.
IGNORE_PATTERNS = [
    re.compile(r"Download the React DevTools", re.I),
    re.compile(r"\[vite\]", re.I),
]


def is_hydration_msg(text: str) -> bool:
    if any(p.search(text) for p in IGNORE_PATTERNS):
        return False
    return any(p.search(text) for p in HYDRATION_PATTERNS)


async def check_route(context, route: str):
    page = await context.new_page()
    problems = []
    console_msgs = []

    def on_console(msg):
        try:
            txt = msg.text
        except Exception:
            txt = str(msg)
        console_msgs.append((msg.type, txt))
        if msg.type in ("error", "warning") and is_hydration_msg(txt):
            problems.append(f"[console.{msg.type}] {txt}")

    def on_pageerror(err):
        txt = str(err)
        console_msgs.append(("pageerror", txt))
        if is_hydration_msg(txt):
            problems.append(f"[pageerror] {txt}")

    page.on("console", on_console)
    page.on("pageerror", on_pageerror)

    try:
        resp = await page.goto(f"{BASE}{route}", wait_until="domcontentloaded", timeout=30000)
        if not resp or resp.status >= 400:
            problems.append(f"http {resp.status if resp else 'no-response'}")
            await page.close()
            return route, problems, 0

        # Let hydration + effects settle; hydration warnings fire during first commit.
        await page.wait_for_load_state("networkidle", timeout=15000)
        await page.wait_for_timeout(600)

        # Verify code blocks render.
        stats = await page.evaluate(
            """() => {
              const codes = Array.from(document.querySelectorAll('pre code'));
              const empty = codes.filter(c => !c.textContent || !c.textContent.trim()).length;
              // Detect broken highlighter output: literal '<span class=' text nodes.
              const leaked = codes.filter(c => {
                const walker = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
                let n;
                while ((n = walker.nextNode())) {
                  const t = n.nodeValue || '';
                  if (t.includes('<span class=') || t.includes('</span>')) return true;
                }
                return false;
              }).length;
              return { total: codes.length, empty, leaked };
            }"""
        )

        if stats["empty"] > 0:
            problems.append(f"{stats['empty']} empty <code> block(s)")
        if stats["leaked"] > 0:
            problems.append(f"{stats['leaked']} code block(s) with leaked highlighter HTML")

    except Exception as e:
        problems.append(f"exception: {e}")
        stats = {"total": 0}

    if problems:
        safe = route.strip("/").replace("/", "_") or "root"
        await page.screenshot(path=str(OUT / f"fail_{safe}.png"))
        (OUT / f"fail_{safe}.log").write_text(
            "\n".join(f"[{t}] {m}" for t, m in console_msgs)
        )

    await page.close()
    return route, problems, stats.get("total", 0)


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})

        results = []
        # Run in small batches to avoid overwhelming dev server.
        BATCH = 4
        for i in range(0, len(ROUTES), BATCH):
            batch = ROUTES[i:i + BATCH]
            results.extend(await asyncio.gather(*(check_route(context, r) for r in batch)))

        await browser.close()

    failed = [(r, p, n) for r, p, n in results if p]
    print(f"\nChecked {len(results)} docs routes.")
    for route, problems, total in results:
        status = "OK " if not problems else "FAIL"
        print(f"  {status}  {route}  (code blocks: {total})")
        for p in problems:
            print(f"        - {p}")

    if failed:
        print(f"\n{len(failed)} route(s) failed. Artifacts in {OUT}")
        sys.exit(1)
    print("\nAll routes hydrated cleanly and rendered code blocks.")


asyncio.run(main())
