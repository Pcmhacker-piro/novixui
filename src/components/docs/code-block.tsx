import { useMemo, useState, type ReactNode } from "react";
import { Check, ChevronDown, Copy, Terminal as TerminalIcon } from "lucide-react";
import { cn } from "@/nova/utils";

/**
 * Nova docs · CodeBlock
 *
 * A calm, high-signal code surface with:
 *  • Optional filename / language chip
 *  • Copy-to-clipboard
 *  • Line numbers
 *  • Highlighted lines
 *  • Collapse when > maxLines
 *  • Lightweight regex-based syntax colouring (TSX/JS/CSS/JSON/bash)
 *
 * No PrismJS. No Shiki. No 400kb of grammar files. This is a docs surface;
 * we prioritize scan-ability and page weight over spec-perfect tokens.
 */
export function CodeBlock({
  code,
  language = "tsx",
  title,
  filename,
  showLineNumbers = false,
  highlightLines,
  maxLines,
  className,
  children,
}: {
  code: string;
  language?: string;
  title?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  maxLines?: number;
  className?: string;
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const lines = useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);
  const collapsible = typeof maxLines === "number" && lines.length > maxLines;
  const visibleLines = collapsible && !expanded ? lines.slice(0, maxLines) : lines;
  const hlSet = useMemo(() => new Set(highlightLines ?? []), [highlightLines]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const label = filename ?? title ?? language;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-[#08080c] text-[#e4e4e7] shadow-xl [color-scheme:dark]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3.5 py-2">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-zinc-400">
          <span className="inline-flex size-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <span className="text-zinc-300 font-semibold">{label}</span>
          {filename && (
            <span className="ml-2 rounded border border-white/10 bg-white/5 px-1.5 py-[1px] text-[9.5px] normal-case tracking-normal text-zinc-400">
              {language}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex size-7 items-center justify-center rounded-md text-zinc-400 opacity-70 transition hover:bg-white/10 hover:text-white group-hover:opacity-100 cursor-pointer"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
        </button>
      </div>

      <div className="relative">
        <pre className="overflow-x-auto py-4 font-mono text-[12.5px] leading-relaxed text-[#e4e4e7]">
          {children ? (
            <code className="block px-4 text-[#e4e4e7]">{children}</code>
          ) : (
            <code className="block">
              {visibleLines.map((raw, i) => {
                const n = i + 1;
                const hl = hlSet.has(n);
                return (
                  <div
                    key={n}
                    className={cn(
                      "flex min-w-max whitespace-pre px-4",
                      hl && "bg-cyan-500/10 shadow-[inset_2px_0_0_0_#22d3ee]",
                    )}
                  >
                    {showLineNumbers && (
                      <span
                        aria-hidden
                        className="mr-4 inline-block w-6 select-none text-right text-zinc-600"
                      >
                        {n}
                      </span>
                    )}
                    <span
                      className="text-zinc-200"
                      // Simple regex highlighter — safe because input is prop-controlled by us
                      dangerouslySetInnerHTML={{ __html: highlight(raw, language) || "&nbsp;" }}
                    />
                  </div>
                );
              })}
            </code>
          )}
        </pre>

        {collapsible && !expanded && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#08080c] to-transparent"
          />
        )}
      </div>

      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex w-full items-center justify-center gap-1.5 border-t border-white/10 bg-white/[0.02] py-2 text-[11.5px] font-mono uppercase tracking-[0.14em] text-zinc-400 transition hover:bg-white/5 hover:text-white cursor-pointer"
        >
          <ChevronDown size={12} className={cn("transition-transform", expanded && "rotate-180")} />
          {expanded ? "Collapse" : `Expand · ${lines.length - (maxLines ?? 0)} more lines`}
        </button>
      )}
    </div>
  );
}

/* ────────────────── Terminal & Diff variants ────────────────── */

/** A terminal-style block. Each line is prefixed with a subtle `$`. */
export function TerminalBlock({
  code,
  title = "Terminal",
  className,
}: {
  code: string;
  title?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-[#06060a] text-white/90 shadow-xl [color-scheme:dark]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3.5 py-2">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-zinc-400">
          <TerminalIcon size={12} className="text-cyan-400" />
          <span className="text-zinc-300 font-semibold">{title}</span>
        </div>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Copied" : "Copy command"}
          className="inline-flex size-7 items-center justify-center rounded-md text-zinc-400 opacity-70 transition hover:bg-white/10 hover:text-white group-hover:opacity-100 cursor-pointer"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-zinc-200">
        <code>
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre">
              <span className="mr-2 select-none text-emerald-400">$</span>
              <span>{l}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

/**
 * Diff block — accepts a unified-ish string where lines start with `+`, `-`, or ` `.
 */
export function DiffBlock({
  code,
  filename,
  className,
}: {
  code: string;
  filename?: string;
  className?: string;
}) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-[#08080c] text-white/90 shadow-xl [color-scheme:dark]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3.5 py-2 text-[11px] font-mono uppercase tracking-[0.14em] text-zinc-400">
        <span className="text-zinc-300 font-semibold">{filename ?? "diff"}</span>
        <span className="flex items-center gap-3 normal-case tracking-normal">
          <span className="text-emerald-400">+ added</span>
          <span className="text-rose-400">- removed</span>
        </span>
      </div>
      <pre className="overflow-x-auto py-3 font-mono text-[12.5px] leading-relaxed text-zinc-200">
        <code className="block">
          {lines.map((raw, i) => {
            const kind = raw[0] === "+" ? "add" : raw[0] === "-" ? "sub" : "ctx";
            return (
              <div
                key={i}
                className={cn(
                  "flex whitespace-pre px-4",
                  kind === "add" && "bg-emerald-500/15 text-emerald-300",
                  kind === "sub" && "bg-rose-500/15 text-rose-300",
                  kind === "ctx" && "text-zinc-400",
                )}
              >
                <span aria-hidden className="mr-3 w-3 select-none opacity-70">
                  {kind === "add" ? "+" : kind === "sub" ? "-" : " "}
                </span>
                <span>{raw.slice(raw[0] === "+" || raw[0] === "-" || raw[0] === " " ? 1 : 0)}</span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

/** Inline command chip — used for `npm i` snippets. */
export function CommandChip({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(cmd);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* noop */
        }
      }}
      className="group inline-flex h-9 items-center gap-2.5 rounded-md border border-white/15 bg-[#0a0a0f] px-3 font-mono text-[13px] text-zinc-100 shadow-sm transition hover:border-cyan-400/40 hover:bg-[#0e0e16] cursor-pointer"
    >
      <span className="text-cyan-400 font-bold">$</span>
      <span>{cmd}</span>
      <span className="ml-1 text-zinc-400 transition-colors group-hover:text-white">
        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
      </span>
    </button>
  );
}

/* ────────────────── Regex highlighter ────────────────── */

function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const KW = new Set([
  "import","from","export","default","const","let","var","function","return","if","else",
  "for","while","switch","case","break","continue","await","async","new","class","extends",
  "typeof","instanceof","in","of","as","type","interface","null","undefined","true","false","this",
]);

type Tok = { t: string; cls?: string };

/**
 * Single-pass tokenizer. Text is escaped once and each token wrapped exactly
 * once, so class names inside emitted <span>s can never be re-matched by a
 * later regex (which was the source of the earlier hydration mismatch).
 */
function tokenize(line: string, lang: string): Tok[] {
  const isCss = /^(css|scss)$/i.test(lang);
  const isBash = /^(bash|sh|shell|zsh)$/i.test(lang);
  const isJson = /^json$/i.test(lang);
  const out: Tok[] = [];
  let i = 0;
  const push = (t: string, cls?: string) => { if (t) out.push({ t, cls }); };

  const muted = "text-muted-foreground/70 italic";
  const strCls = "text-emerald-300/90";
  const numCls = "text-amber-300/90";
  const kwCls = "text-fuchsia-300/90 font-medium";
  const tagCls = "text-sky-300/90";
  const attrCls = "text-violet-300/90";
  const fnCls = "text-cyan-300/90";

  while (i < line.length) {
    const ch = line[i];
    const rest = line.slice(i);

    if (!isCss && !isBash && ch === "/" && line[i + 1] === "/") {
      push(line.slice(i), muted); break;
    }
    if (isBash && ch === "#" && (i === 0 || /\s/.test(line[i - 1]))) {
      push(line.slice(i), muted); break;
    }
    if (isCss && ch === "/" && line[i + 1] === "*") {
      const end = line.indexOf("*/", i + 2);
      const stop = end === -1 ? line.length : end + 2;
      push(line.slice(i, stop), muted); i = stop; continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      const q = ch; let j = i + 1;
      while (j < line.length && line[j] !== q) { if (line[j] === "\\") j += 2; else j++; }
      j = Math.min(j + 1, line.length);
      push(line.slice(i, j), strCls); i = j; continue;
    }
    const nm = /^-?\d+\.?\d*/.exec(rest);
    if (nm && (i === 0 || /[^A-Za-z_]/.test(line[i - 1]))) {
      push(nm[0], numCls); i += nm[0].length; continue;
    }
    if (!isCss && !isJson && !isBash && ch === "<") {
      const m = /^<\/?([A-Za-z][\w.-]*)/.exec(rest);
      if (m) {
        push(m[0][1] === "/" ? "</" : "<");
        push(m[1], tagCls);
        i += m[0].length; continue;
      }
    }
    if (isCss && ch === "-" && line[i + 1] === "-") {
      const m = /^--[\w-]+/.exec(rest);
      if (m) { push(m[0], tagCls); i += m[0].length; continue; }
    }
    if (isCss && ch === "#") {
      const m = /^#[0-9a-fA-F]{3,8}\b/.exec(rest);
      if (m) { push(m[0], numCls); i += m[0].length; continue; }
    }
    const id = /^[A-Za-z_$][\w$]*/.exec(rest);
    if (id) {
      const word = id[0];
      const after = line[i + word.length];
      if (isJson) {
        if (word === "true" || word === "false" || word === "null") push(word, numCls);
        else push(word);
      } else if (isCss) {
        if (after === ":") push(word, attrCls);
        else push(word);
      } else if (KW.has(word)) {
        push(word, kwCls);
      } else if (after === "=" && line[i + word.length + 1] !== "=") {
        push(word, attrCls);
      } else if (after === "(") {
        push(word, fnCls);
      } else {
        push(word);
      }
      i += word.length; continue;
    }
    push(ch); i++;
  }
  return out;
}

function highlight(line: string, lang: string): string {
  const toks = tokenize(line, lang);
  if (toks.length === 0) return "";
  return toks
    .map((t) => (t.cls ? `<span class="${t.cls}">${escape(t.t)}</span>` : escape(t.t)))
    .join("");
}
