import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Accessibility,
  Check,
  Code,
  Copy,
  Eye,
  Maximize2,
  Minimize2,
  Monitor,
  Moon,
  Repeat,
  Smartphone,
  Sun,
  Tablet,
  X,
} from "lucide-react";
import { cn } from "@/nova/utils";

type Tab = "preview" | "code";
type Viewport = "sm" | "md" | "lg";
type ThemeOverride = "auto" | "light" | "dark";

const VIEWPORT_WIDTHS: Record<Viewport, number> = { sm: 380, md: 768, lg: 1120 };

/**
 * Nova docs · ComponentPreview
 *
 * Interactive learning surface — every component page's canonical demo.
 *  • Preview / Code tabs
 *  • Copy source
 *  • Replay (remounts children)
 *  • Responsive viewport toggle
 *  • Theme override (light / dark) — scoped, doesn't affect page
 *  • A11y overlay — highlights focusables + tab order
 *  • Expand to fullscreen
 */
export function ComponentPreview({
  code,
  children,
  className,
  align = "center",
  replayable = false,
  filename,
}: {
  code: string;
  children: ReactNode;
  className?: string;
  align?: "center" | "start";
  replayable?: boolean;
  filename?: string;
}) {
  const [tab, setTab] = useState<Tab>("preview");
  const [nonce, setNonce] = useState(0);
  const [copied, setCopied] = useState(false);
  const [viewport, setViewport] = useState<Viewport>("lg");
  const [themeOv, setThemeOv] = useState<ThemeOverride>("auto");
  const [a11y, setA11y] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const body = (
    <div
      className={cn(
        "nova-card-surface nova-card-moon-edge overflow-hidden rounded-xl",
        expanded && "size-full rounded-none border-0",
        className,
      )}
    >
      {/* Header — tabs + actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 px-3 py-2">
        <div
          role="tablist"
          aria-label="Preview or code"
          className="relative inline-flex items-center rounded-md bg-subtle/60 p-0.5 text-xs"
        >
          {(["preview", "code"] as const).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t)}
                className={cn(
                  "relative z-10 inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-1 font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t === "preview" ? <Eye size={12} /> : <Code size={12} />}
                <span className="capitalize">{t}</span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-[5px] bg-background shadow-[0_1px_0_0_color-mix(in_oklab,white_25%,transparent)_inset,0_1px_2px_0_color-mix(in_oklab,var(--foreground)_10%,transparent)]"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {tab === "preview" && (
            <>
              <SegGroup>
                {(["sm", "md", "lg"] as const).map((v) => (
                  <SegButton
                    key={v}
                    active={viewport === v}
                    onClick={() => setViewport(v)}
                    label={`${VIEWPORT_WIDTHS[v]}px viewport`}
                  >
                    {v === "sm" ? (
                      <Smartphone size={12} />
                    ) : v === "md" ? (
                      <Tablet size={12} />
                    ) : (
                      <Monitor size={12} />
                    )}
                  </SegButton>
                ))}
              </SegGroup>
              <SegGroup>
                {(["light", "dark"] as const).map((t) => (
                  <SegButton
                    key={t}
                    active={themeOv === t}
                    onClick={() => setThemeOv((cur) => (cur === t ? "auto" : t))}
                    label={`${t} preview`}
                  >
                    {t === "light" ? <Sun size={12} /> : <Moon size={12} />}
                  </SegButton>
                ))}
              </SegGroup>
              <IconAction
                active={a11y}
                onClick={() => setA11y((v) => !v)}
                label="Accessibility overlay"
              >
                <Accessibility size={13} />
              </IconAction>
              {replayable && (
                <IconAction onClick={() => setNonce((n) => n + 1)} label="Replay">
                  <Repeat size={13} />
                </IconAction>
              )}
            </>
          )}
          <IconAction onClick={onCopy} label={copied ? "Copied" : "Copy code"}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </IconAction>
          <IconAction onClick={() => setExpanded((e) => !e)} label={expanded ? "Close" : "Expand"}>
            {expanded ? <X size={13} /> : <Maximize2 size={13} />}
          </IconAction>
        </div>
      </div>

      {/* Body */}
      {tab === "preview" ? (
        <div
          data-nova-theme-override={themeOv === "auto" ? undefined : themeOv}
          className={cn(
            "relative",
            themeOv === "light" && "bg-white text-neutral-900 [color-scheme:light]",
            themeOv === "dark" && "bg-neutral-950 text-neutral-100 [color-scheme:dark]",
            expanded && "flex-1 overflow-auto",
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 nova-grid-bg opacity-40"
          />

          <div
            className={cn("relative mx-auto transition-[max-width] duration-300 ease-out")}
            style={{ maxWidth: VIEWPORT_WIDTHS[viewport] }}
          >
            <PreviewStage nonce={nonce} align={align} a11y={a11y} expanded={expanded}>
              {children}
            </PreviewStage>
          </div>

          {viewport !== "lg" && (
            <div className="pointer-events-none absolute right-3 top-3 rounded-md border border-border/60 bg-background/70 px-2 py-1 font-mono text-[10.5px] text-muted-foreground backdrop-blur">
              {VIEWPORT_WIDTHS[viewport]}px
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#08080c] [color-scheme:dark]">
          {filename && (
            <div className="border-b border-white/10 bg-white/[0.02] px-4 py-1.5 font-mono text-[11px] text-zinc-400">
              {filename}
            </div>
          )}
          <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-[#e4e4e7]">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );

  if (!expanded) return body;
  return (
    <AnimatePresence>
      <motion.div
        key="expanded"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-background/85 backdrop-blur-xl p-3 md:p-6"
      >
        {body}
      </motion.div>
    </AnimatePresence>
  );
}

function PreviewStage({
  children,
  nonce,
  align,
  a11y,
  expanded,
}: {
  children: ReactNode;
  nonce: number;
  align: "center" | "start";
  a11y: boolean;
  expanded: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [focusables, setFocusables] = useState(0);

  useEffect(() => {
    if (!a11y || !ref.current) return;
    const els = ref.current.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    setFocusables(els.length);
  }, [a11y, nonce]);

  // Pointer- AND keyboard-driven 3D tilt (unified across every preview).
  // Focus-within resets tilt to a stable, neutral pose so keyboard users
  // get a legible, non-moving surface while tabbing through controls.
  useEffect(() => {
    const stage = tiltRef.current;
    if (!stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      stage.style.transform = "none";
      return;
    }
    let raf = 0;
    let rx = 6;
    let ry = -8;
    let trx = 6;
    let tryv = -8;
    let focusHold = false;
    const loop = () => {
      rx += (trx - rx) * 0.12;
      ry += (tryv - ry) * 0.12;
      stage.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      if (focusHold) return; // keyboard user is driving — don't fight them
      const r = stage.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      trx = -cy * 10;
      tryv = cx * 14;
    };
    const onLeave = () => {
      if (focusHold) return;
      trx = 6;
      tryv = -8;
    };
    const onFocusIn = () => {
      focusHold = true;
      // Neutralize tilt so focused control stays visually stable
      trx = 0;
      tryv = 0;
    };
    const onFocusOut = (e: FocusEvent) => {
      // Only release when focus actually leaves the stage
      if (stage.contains(e.relatedTarget as Node)) return;
      focusHold = false;
      trx = 6;
      tryv = -8;
    };
    const parent = stage.parentElement;
    parent?.addEventListener("pointermove", onMove);
    parent?.addEventListener("pointerleave", onLeave);
    stage.addEventListener("focusin", onFocusIn);
    stage.addEventListener("focusout", onFocusOut);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      parent?.removeEventListener("pointermove", onMove);
      parent?.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("focusin", onFocusIn);
      stage.removeEventListener("focusout", onFocusOut);
    };
  }, [nonce]);

  return (
    <div
      className={cn("relative", "[perspective:1400px]")}
    >
      <div
        key={nonce}
        ref={(node) => {
          ref.current = node;
          tiltRef.current = node;
        }}
        className={cn(
          "relative flex flex-wrap gap-4 p-8 [transform-style:preserve-3d] transition-transform duration-500 ease-out will-change-transform motion-safe:animate-[novaPreviewFloat_9s_ease-in-out_infinite]",
          expanded ? "min-h-[60vh]" : "min-h-56",
          align === "center" ? "items-center justify-center" : "items-start justify-start",
          a11y &&
            "[&_a]:!outline [&_a]:!outline-2 [&_a]:!outline-accent [&_button]:!outline [&_button]:!outline-2 [&_button]:!outline-accent [&_input]:!outline [&_input]:!outline-2 [&_input]:!outline-accent",
        )}
        style={{ transform: "rotateX(6deg) rotateY(-8deg)" }}
      >
        {children}
        {a11y && (
          <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-accent/40 bg-accent/10 px-2 py-1 font-mono text-[10.5px] text-accent">
            {focusables} focusable{focusables === 1 ? "" : "s"}
          </div>
        )}
      </div>
      <style>{`
        @keyframes novaPreviewFloat {
          0%, 100% { translate: 0 0; }
          50%      { translate: 0 -4px; }
        }
      `}</style>
    </div>
  );
}

function SegGroup({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center rounded-md border border-border/60 bg-subtle/40 p-0.5">
      {children}
    </div>
  );
}
function SegButton({
  children,
  active,
  onClick,
  label,
}: {
  children: ReactNode;
  active?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "nova-focus-ring inline-flex size-6 items-center justify-center rounded-[4px] transition-colors",
        active
          ? "bg-background text-foreground shadow-[0_1px_0_0_color-mix(in_oklab,white_22%,transparent)_inset]"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function IconAction({
  children,
  onClick,
  label,
  active,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active || undefined}
      className={cn(
        "nova-focus-ring inline-flex size-7 items-center justify-center rounded-md transition",
        active
          ? "bg-accent/15 text-accent"
          : "text-muted-foreground hover:bg-subtle hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
