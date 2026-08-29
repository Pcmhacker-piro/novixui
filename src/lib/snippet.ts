/**
 * Hardened snippet extractor.
 *
 * Every gallery item exposes a `render()` that returns a ReactNode plus an
 * optional pre-authored `code` string. Historically the CodeModal fell back to
 * `render.toString()`, which returned the compiled JS (`_jsx(...)`), leaked
 * component identifiers that aren't in scope for the copied snippet, and
 * produced wildly different formatting per item.
 *
 * `extractSnippet` normalizes the output so the modal always shows valid,
 * consistent code regardless of the source shape.
 */

import { isValidElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export type SnippetInput = {
  id?: string;
  name?: string;
  code?: string | null;
  render?: (() => ReactNode) | null;
};

/** Collapse trailing whitespace and normalize leading indentation. */
function dedent(input: string): string {
  const lines = input.replace(/\r\n?/g, "\n").split("\n");
  // Trim shared leading indent (ignoring blank lines).
  let min = Infinity;
  for (const line of lines) {
    if (!line.trim()) continue;
    const match = line.match(/^[ \t]*/);
    if (match) min = Math.min(min, match[0].length);
  }
  if (!isFinite(min) || min === 0) return lines.join("\n").trim() + "\n";
  return lines.map((l) => (l.length >= min ? l.slice(min) : l)).join("\n").trim() + "\n";
}

/** Format a flat HTML string with basic 2-space indentation. */
function formatHtml(html: string): string {
  const voidTags = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
  ]);
  // Split on tag boundaries, keeping tags.
  const tokens = html
    .replace(/></g, ">\n<")
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);

  const out: string[] = [];
  let depth = 0;
  for (const tok of tokens) {
    const isClose = /^<\//.test(tok);
    const openMatch = tok.match(/^<([a-zA-Z][a-zA-Z0-9-]*)/);
    const tagName = openMatch?.[1]?.toLowerCase();
    const isSelfClosing = /\/>$/.test(tok) || (tagName ? voidTags.has(tagName) : false);
    const isFragment = !/^</.test(tok);

    if (isClose) depth = Math.max(0, depth - 1);
    out.push("  ".repeat(depth) + tok);
    if (!isClose && !isSelfClosing && !isFragment && openMatch) depth += 1;
  }
  return out.join("\n") + "\n";
}

/** Best-effort recovery from a compiled render function toString(). */
function fallbackFromToString(fn: () => ReactNode, name?: string): string {
  const raw = fn.toString();
  const header = name ? `/* ${name} — source snippet unavailable */\n` : "";
  return header + raw.trim() + "\n";
}

/**
 * Return a stable, human-readable snippet for the given item.
 *
 * Order of preference:
 *  1. Author-provided `code` (dedented, trailing newline normalized).
 *  2. Rendered HTML from `render()` via renderToStaticMarkup — captures the
 *     final DOM output with resolved className / style / attributes, safe to
 *     copy into any project.
 *  3. `render.toString()` wrapped in a header comment (last resort).
 *  4. Empty-state placeholder so the modal never renders `undefined`.
 */
export function extractSnippet(item: SnippetInput): string {
  if (item.code && item.code.trim()) {
    return dedent(item.code);
  }

  const render = item.render;
  if (typeof render === "function") {
    try {
      const node = render();
      if (node == null || node === false) {
        return fallbackFromToString(render, item.name);
      }
      // Only feed React elements / arrays to the renderer; primitives are
      // stringified verbatim to avoid noisy wrappers.
      if (typeof node === "string" || typeof node === "number") {
        return String(node).trim() + "\n";
      }
      if (isValidElement(node) || Array.isArray(node)) {
        const html = renderToStaticMarkup(node as ReactNode);
        const header = item.name ? `<!-- ${item.name} — Novix UI -->\n` : "";
        return header + formatHtml(html);
      }
      return fallbackFromToString(render, item.name);
    } catch {
      return fallbackFromToString(render, item.name);
    }
  }

  return `/* ${item.name ?? "Snippet"} — no source available */\n`;
}
