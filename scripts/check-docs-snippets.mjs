#!/usr/bin/env node
/**
 * Extract fenced code blocks from every docs source and typecheck + lint them.
 *
 * Sources:
 *   1. Markdown under docs/           — ```lang ... ``` fences.
 *   2. TSX route files matching src/routes/docs*.tsx — `code={`...`}` template
 *      literals passed to <CodeBlock /> and <ComponentPreview />.
 *
 * Snippets are written to .snippet-check/ with best-effort language detection,
 * then run through `tsgo --noEmit` and `eslint` in a single batch. Snippets
 * that are shell/css/json/plaintext are skipped for TS checks but still
 * counted so the report is complete.
 *
 * Usage: node scripts/check-docs-snippets.mjs
 * Exit code is non-zero if any snippet fails typecheck or lint.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, ".snippet-check");
const SRC = join(OUT, "src");

const TS_LANGS = new Set(["ts", "tsx", "typescript", "js", "jsx", "javascript"]);
const SKIP_LANGS = new Set([
  "sh", "bash", "shell", "zsh", "console", "text", "txt", "",
  "css", "html", "json", "md", "markdown", "toml", "yaml", "yml",
  "sql", "diff", "env", "dotenv", "ini",
]);

/** Recursively list files under a directory matching a predicate. */
function walk(dir, pred, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, pred, acc);
    else if (pred(p)) acc.push(p);
  }
  return acc;
}

/** Parse ```lang ... ``` fences from a markdown file. */
function extractFromMarkdown(text) {
  const out = [];
  const re = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(text))) out.push({ lang: m[1].toLowerCase(), code: m[2] });
  return out;
}

/**
 * Parse code={`...`} template literals from a TSX file. Handles nested `${...}`
 * expressions by tracking brace depth so we don't stop at the first backtick
 * inside an interpolation.
 */
function extractFromTsx(text) {
  const out = [];
  const marker = "code={`";
  let i = 0;
  const decode = (esc) => ({ n: "\n", t: "\t", r: "\r", "\\": "\\", "`": "`", "$": "$", "'": "'", '"': '"' }[esc] ?? esc);
  while ((i = text.indexOf(marker, i)) !== -1) {
    let j = i + marker.length;
    let braceDepth = 0;
    let buf = "";
    while (j < text.length) {
      const ch = text[j];
      if (ch === "\\" && j + 1 < text.length) { buf += decode(text[j + 1]); j += 2; continue; }
      if (ch === "$" && text[j + 1] === "{") { braceDepth++; buf += "${"; j += 2; continue; }
      if (ch === "}" && braceDepth > 0) { braceDepth--; buf += "}"; j++; continue; }
      if (ch === "`" && braceDepth === 0) { j++; break; }
      buf += ch; j++;
    }
    const code = buf.replace(/\$\{[^}]*\}/g, "PLACEHOLDER");
    let lang = "tsx";
    if (/^\s*(npm|pnpm|yarn|bun|npx)\s/.test(code)) lang = "sh";
    else if (/^\s*(\/\*|@[a-z-]+|:root|\.[\w-]+\s*\{|[a-z-]+\s*:\s*[^;{}\n]+;)/.test(code)) lang = "css";
    else if (/^\s*\{[\s\S]*\}\s*$/.test(code) && !/[<;]/.test(code)) lang = "json";
    out.push({ lang, code });
    i = j;
  }
  return out;
}

/** Wrap loose expressions/JSX so they type-check as a complete module. */
function wrapSnippet(code) {
  const trimmed = code.trim();
  const hasImport = /^\s*import\s/m.test(code);
  const hasExport = /^\s*export\s/m.test(code);
  const hasTopLevelDecl = /^\s*(function|class|const|let|var|type|interface|enum)\s/m.test(code);
  const looksLikeJsx = trimmed.startsWith("<");
  if (hasImport || hasExport || hasTopLevelDecl) return code;
  if (looksLikeJsx) {
    return `import * as React from "react";\nexport default function Demo(): React.ReactNode {\n  return (\n    <>\n${code}\n    </>\n  );\n}\n`;
  }
  return code;
}


// -------- collect ---------------------------------------------------------

const snippets = [];
const mdFiles = walk(join(ROOT, "docs"), (p) => p.endsWith(".md"));
for (const f of mdFiles) {
  for (const [idx, s] of extractFromMarkdown(readFileSync(f, "utf8")).entries()) {
    snippets.push({ source: relative(ROOT, f), index: idx, ...s });
  }
}
const routeFiles = walk(join(ROOT, "src/routes"), (p) => /docs.*\.tsx$/.test(p));
for (const f of routeFiles) {
  for (const [idx, s] of extractFromTsx(readFileSync(f, "utf8")).entries()) {
    snippets.push({ source: relative(ROOT, f), index: idx, ...s });
  }
}

console.log(`Collected ${snippets.length} snippets from ${mdFiles.length} md + ${routeFiles.length} tsx files`);

// -------- write -----------------------------------------------------------

rmSync(OUT, { recursive: true, force: true });
mkdirSync(SRC, { recursive: true });

const written = [];
const skipped = [];
for (const s of snippets) {
  const slug = s.source.replace(/[^\w]+/g, "_") + "_" + s.index;
  if (SKIP_LANGS.has(s.lang) || (!TS_LANGS.has(s.lang) && s.lang !== "tsx")) {
    skipped.push({ ...s, slug, reason: `lang=${s.lang || "none"}` });
    continue;
  }
  const ext = s.lang === "js" || s.lang === "javascript" ? "js"
            : s.lang === "jsx" ? "jsx"
            : s.lang === "ts" || s.lang === "typescript" ? "ts"
            : "tsx";
  const file = join(SRC, `${slug}.${ext}`);
  writeFileSync(file, wrapSnippet(s.code));
  written.push({ ...s, file: relative(ROOT, file) });
}

// tsconfig that only covers the snippet dir, reuses project paths.
writeFileSync(join(OUT, "tsconfig.json"), JSON.stringify({
  extends: "../tsconfig.json",
  include: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.js", "src/**/*.jsx"],
  compilerOptions: {
    noEmit: true,
    allowJs: true,
    checkJs: false,
    noUnusedLocals: false,
    noUnusedParameters: false,
    // Snippets are illustrative — allow unresolved package imports without
    // failing the build (published package name isn't installed locally).
    paths: { "@/*": ["../src/*"], "@novix-ui/*": ["../src/nova/*"] },
    skipLibCheck: true,
  },
}, null, 2));

console.log(`Wrote ${written.length} typecheckable snippets, skipped ${skipped.length}`);

// -------- check -----------------------------------------------------------

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: "inherit", cwd: ROOT, ...opts });
  return r.status ?? 1;
}

// Docs snippets often elide imports for brevity or reference the published
// package name (`@novix-ui/*`) that isn't installed locally. Filter out the
// error codes that reflect those illustrative-code conventions; treat every
// other diagnostic as a real snippet bug.
const IGNORE_TS_CODES = new Set([
  "TS2304", "TS2307", "TS7031", "TS7006", "TS2503", "TS2552",
  "TS2391", // function decl without impl (illustrative signatures)
  "TS2593", // test/expect globals from unavailable @types
]);


function runTsgo() {
  const r = spawnSync("bunx", ["tsgo", "--noEmit", "-p", ".snippet-check/tsconfig.json"], {
    cwd: ROOT, encoding: "utf8",
  });
  const output = (r.stdout || "") + (r.stderr || "");
  const lines = output.split("\n").filter(Boolean);
  const real = lines.filter((l) => {
    const m = l.match(/error (TS\d+):/);
    return m ? !IGNORE_TS_CODES.has(m[1]) : false;
  });
  const ignored = lines.length - real.length;
  if (real.length) console.error(real.join("\n"));
  console.log(`  ${real.length} real errors, ${ignored} ignored (unresolved imports / implicit any).`);
  return real.length === 0 ? 0 : 1;
}

let failures = 0;
console.log("\n→ tsgo --noEmit");
if (runTsgo() !== 0) failures++;



console.log("\n→ eslint");
const lintFiles = written.map((w) => w.file);
if (lintFiles.length && run("npx", [
  "eslint", "-c", "scripts/snippet-eslint.config.mjs", "--no-inline-config",
  ...lintFiles,
]) !== 0) failures++;



if (failures) {
  console.error(`\n✖ Docs snippet check failed (${failures} stage${failures > 1 ? "s" : ""}).`);
  process.exit(1);
}
console.log("\n✓ All docs snippets pass typecheck + lint.");
