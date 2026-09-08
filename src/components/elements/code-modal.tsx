import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, Sparkles, X } from "lucide-react";
import { extractSnippet } from "@/lib/snippet";
import { useReducedMotion } from "motion/react";
import {
  detectCategory,
  getDefaultCustomization,
  hasCustomizations,
  generateCustomizedCode,
  CustomizerPreviewWrapper,
  ElementCustomizerPanel,
  type ElementCustomization,
} from "./element-customizer";

export type CodeModalItem = { id: string; name: string; render: () => ReactNode; code: string };

export function CodeModal({
  item,
  onClose,
  shareCategory,
  hostAttr,
  preview,
}: {
  item: CodeModalItem;
  onClose: () => void;
  shareCategory?: string;
  hostAttr?: string;
  preview?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [tab, setTab] = useState<"react" | "css">("react");
  const [light, setLight] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previewFrameRef = useRef<HTMLDivElement | null>(null);
  const titleId = useMemo(() => `code-modal-title-${item.id}`, [item.id]);
  const prefersReducedMotion = useReducedMotion();

  // Category & Customization state
  const category = useMemo(
    () => detectCategory(shareCategory, hostAttr, item.id, item.name),
    [shareCategory, hostAttr, item.id, item.name],
  );
  const defaultCustom = useMemo(
    () => getDefaultCustomization(category, item.name),
    [category, item.name],
  );
  const [custom, setCustom] = useState<ElementCustomization>(defaultCustom);

  // Sync state when item changes
  useEffect(() => {
    setCustom(defaultCustom);
  }, [defaultCustom]);

  const isDefault = useMemo(
    () => !hasCustomizations(custom, defaultCustom),
    [custom, defaultCustom],
  );

  const handleResetCustom = () => setCustom(defaultCustom);
  const handleUpdateCustom = (patch: Partial<ElementCustomization>) => {
    setCustom((prev) => ({ ...prev, ...patch }));
  };

  // Many data files ship a placeholder `code` string that only points at the
  // source file. Detect that and regenerate real, copy-pasteable markup from
  // the rendered React tree so the code pane always matches the preview.
  const baseReactCode = useMemo(() => {
    const raw = (item.code ?? "").trim();
    const isPlaceholder =
      !raw ||
      /Full source (available )?in|See source:|no source available/i.test(raw);
    if (!isPlaceholder) return item.code;
    return extractSnippet({ name: item.name, render: item.render });
  }, [item.code, item.name, item.render]);

  const reactCode = useMemo(() => {
    return generateCustomizedCode(baseReactCode, custom, category);
  }, [baseReactCode, custom, category]);

  useEffect(() => {
    if (!exportOpen) return;
    const onDown = (e: globalThis.MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    // Defer to next frame so the click that opened the menu doesn't immediately close it.
    const raf = requestAnimationFrame(() => document.addEventListener("mousedown", onDown));
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousedown", onDown);
    };
  }, [exportOpen]);

  const download = (kind: "react" | "css" | "html") => {
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const ext = kind === "react" ? "tsx" : kind === "css" ? "css" : "html";
    const body =
      kind === "html"
        ? `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8" />\n<title>${item.name} — Novix UI</title>\n<script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-neutral-950 min-h-screen grid place-items-center">\n<!-- ${item.name} -->\n${reactCode}\n</body>\n</html>\n`
        : (kind === "react" ? reactCode : source);
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  // Escape handling + scroll lock + focus save/restore + Tab focus trap.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = (): HTMLElement[] => {
      const root = dialogRef.current;
      if (!root) return [];
      const nodes = root.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',
      );
      return Array.from(nodes).filter((el) => !el.hasAttribute("aria-hidden") && el.offsetParent !== null);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (exportOpen) {
          setExportOpen(false);
          return;
        }
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = getFocusable();
      if (focusables.length === 0) {
        e.preventDefault();
        dialogRef.current?.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    // Body scroll lock: preserve scroll position, compensate for scrollbar
    // width to avoid layout shift, and prevent iOS rubber-band scrolling.
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      paddingRight: document.body.style.paddingRight,
      htmlOverscroll: document.documentElement.style.overscrollBehavior,
    };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.documentElement.style.overscrollBehavior = "none";

    let attempts = 0;
    let rafId = 0;
    let timeoutId: number | undefined;
    const focusClose = () => {
      const btn = closeBtnRef.current;
      if (btn && document.contains(btn)) {
        btn.focus();
        if (document.activeElement === btn) return;
      }
      if (attempts++ < 5) {
        rafId = requestAnimationFrame(focusClose);
        return;
      }
      const dialog = dialogRef.current;
      if (dialog) {
        const [first] = getFocusable();
        first?.focus();
      }
    };
    rafId = requestAnimationFrame(focusClose);
    timeoutId = window.setTimeout(() => {
      const dialog = dialogRef.current;
      if (dialog && !dialog.contains(document.activeElement)) {
        closeBtnRef.current?.focus();
      }
    }, 200);

    return () => {
      cancelAnimationFrame(rafId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.left = prev.left;
      document.body.style.right = prev.right;
      document.body.style.width = prev.width;
      document.body.style.paddingRight = prev.paddingRight;
      document.documentElement.style.overscrollBehavior = prev.htmlOverscroll;
      window.scrollTo(0, scrollY);
      previouslyFocused?.focus?.();
    };
  }, [onClose, exportOpen]);

  // Fake but consistent stats per item (stable across renders)
  const stats = useMemo(() => {
    let h = 0;
    for (let i = 0; i < item.id.length; i++) h = (h * 31 + item.id.charCodeAt(i)) >>> 0;
    const views = 4 + (h % 42); // 4K–45K
    const saves = 1 + ((h >> 5) % 6); // 1K–6K
    return { views: `${views}K`, saves: `${saves}K` };
  }, [item.id]);

  const cssSnippet = useMemo(() => {
    const radiusPx =
      custom.radius === "sharp"
        ? "0px"
        : custom.radius === "sm"
          ? "8px"
          : custom.radius === "md"
            ? "14px"
            : "inherit";
    return `/* ${item.name} — Novix UI (Customized)
 * Theme: ${custom.accentName} (${custom.accentColor})
 * Radius: ${custom.radius} (${radiusPx}) · Glow: ${custom.glow}
 */
:root {
  --accent: ${custom.accentColor};
  --accent-spark: ${custom.accentGradient};
  --radius: ${radiusPx};
  --speed: ${custom.speed}s;
}

.nova-component {
  position: relative;
  isolation: isolate;
  border-radius: var(--radius);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.3s ease,
              border-color 0.2s ease;
  box-shadow: 0 12px 32px -10px ${custom.accentColor}50;
}

.nova-component:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px -8px ${custom.accentColor}70;
}

.nova-component:active {
  transform: translateY(1px);
}

@media (prefers-reduced-motion: reduce) {
  .nova-component {
    transition: none;
    transform: none !important;
  }
}`;
  }, [item.name, custom]);

  const source = tab === "react" ? reactCode : cssSnippet;

  const naturalPreviewSize = useMemo(
    () => (hostAttr === "data-kt-hover-host" ? { width: 720, height: 420 } : { width: 420, height: 288 }),
    [hostAttr],
  );
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const frame = previewFrameRef.current;
    if (!frame) return;

    const updateScale = () => {
      const styles = window.getComputedStyle(frame);
      const horizontalPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      const verticalPadding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      const availableWidth = Math.max(1, frame.clientWidth - horizontalPadding);
      const availableHeight = Math.max(1, frame.clientHeight - verticalPadding);
      const nextScale = Math.min(
        1,
        availableWidth / naturalPreviewSize.width,
        availableHeight / naturalPreviewSize.height,
      );
      setPreviewScale(Number.isFinite(nextScale) ? nextScale : 1);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    window.addEventListener("resize", updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [naturalPreviewSize.height, naturalPreviewSize.width]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      className={`fixed inset-0 z-[100] grid place-items-center overflow-y-auto overscroll-contain bg-background/70 p-3 backdrop-blur-xl sm:p-6 ${prefersReducedMotion ? "" : "animate-in fade-in duration-200"}`}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="nova-glass relative flex max-h-[calc(100dvh-1.5rem)] w-[min(100%,88rem)] min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-background text-foreground shadow-[0_40px_120px_-20px_color-mix(in_oklab,var(--foreground)_35%,transparent)] focus:outline-none sm:max-h-[calc(100dvh-3rem)]"
        style={prefersReducedMotion ? undefined : { animation: "nova-modal-in .3s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <h2 id={titleId} className="sr-only">{item.name} — code and preview</h2>
        {/* Header */}
        <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 px-4 py-3 sm:flex sm:flex-wrap sm:justify-between sm:px-5">
          <button
            onClick={onClose}
            className="inline-flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
          >
            <span aria-hidden>←</span> Go back
          </button>
          <div className="flex shrink-0 items-center gap-2 text-[12px] text-muted-foreground sm:gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-muted-foreground/80">Element by</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                <span
                  aria-hidden
                  className="grid size-5 place-items-center rounded-md text-[10px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}
                >
                  N
                </span>
                novix-ui
              </span>
            </div>
            <span className="inline-flex items-center gap-1">
              <span aria-hidden>👁</span> {stats.views}
            </span>
            <button
              onClick={() => setSaved((s) => !s)}
              className={`inline-flex items-center gap-1 transition-colors ${saved ? "text-fuchsia-400" : "hover:text-foreground"}`}
              aria-pressed={saved}
              aria-label="Save to favorites"
            >
              <span aria-hidden>{saved ? "★" : "☆"}</span> {stats.saves}
            </button>
            {shareCategory && (
              <button
                onClick={async () => {
                  try {
                    const url = new URL(window.location.href);
                    url.pathname = "/elements";
                    url.search = "";
                    url.searchParams.set("category", shareCategory);
                    url.searchParams.set("item", item.id);
                    await navigator.clipboard.writeText(url.toString());
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 1400);
                  } catch {}
                }}
                className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-subtle/40 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
                aria-label="Copy deep link to this element"
              >
                {linkCopied ? <><Check size={11} aria-hidden /> Link copied</> : <><span aria-hidden>🔗</span> Copy link</>}
              </button>
            )}
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="nova-focus-ring grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
              aria-label="Close dialog"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        </div>

        {/* Split body */}
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden">
          {/* Preview pane */}
          <div className="relative flex min-h-[min(340px,56dvh)] min-w-0 flex-col justify-between overflow-hidden border-b border-border/60 lg:min-h-0 lg:border-b-0 lg:border-r">
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: light
                    ? "radial-gradient(120% 80% at 50% 0%, #f5f5f5, #e8e8e8 70%)"
                    : "radial-gradient(120% 80% at 50% 0%, #121212, #050505 70%)",
                  transition: "background .35s ease",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                  color: light ? "#000" : "#fff",
                  maskImage: "radial-gradient(60% 55% at 50% 50%, #000, transparent 75%)",
                }}
              />
              <div className="pointer-events-none absolute left-4 top-3 z-30 font-mono text-[11px] text-muted-foreground">
                {light ? "#e8e8e8" : "#0a0a0a"}
              </div>
              <div role="group" aria-label="Preview theme" className="absolute right-4 top-3 z-30 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 p-0.5 shadow-lg backdrop-blur">
                <button
                  type="button"
                  onClick={() => setLight(false)}
                  className={`grid size-6 place-items-center rounded-full text-[11px] transition-colors ${!light ? "bg-subtle text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  aria-label="Dark preview"
                  aria-pressed={!light}
                >
                  <span aria-hidden>☾</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLight(true)}
                  className={`grid size-6 place-items-center rounded-full text-[11px] transition-colors ${light ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                  aria-label="Light preview"
                  aria-pressed={light}
                >
                  <span aria-hidden>☀</span>
                </button>
              </div>
              <div
                ref={previewFrameRef}
                className={[
                  "relative z-10 flex h-full min-h-0 w-full justify-start overflow-auto overscroll-contain max-h-[min(56dvh,620px)] lg:max-h-none",
                  preview ? "p-3 sm:justify-center sm:p-4" : "p-4 sm:justify-center sm:p-6",
                ].join(" ")}
              >
                <div
                  className="mx-auto shrink-0"
                  style={{
                    width: naturalPreviewSize.width * previewScale,
                    height: naturalPreviewSize.height * previewScale,
                  }}
                >
                  <div
                    className="origin-top-left [&>*]:w-full"
                    style={{
                      width: naturalPreviewSize.width,
                      transform: `scale(${previewScale})`,
                    }}
                  >
                    <CustomizerPreviewWrapper custom={custom} category={category}>
                      {preview ?? (
                        <div
                          {...(hostAttr ? { [hostAttr]: "" } : {})}
                          className={[
                            "group relative flex min-h-72 w-full items-center justify-center rounded-2xl border px-6 py-8",
                            light
                              ? "border-black/10 bg-gradient-to-b from-white to-neutral-100 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)]"
                              : "border-white/8 bg-gradient-to-b from-[#0f0f10] to-[#050505] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.7)]",
                          ].join(" ")}
                        >
                          {!light && (
                            <span
                              aria-hidden
                              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                            />
                          )}
                          {item.render()}
                        </div>
                      )}
                    </CustomizerPreviewWrapper>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Customizer Control Panel */}
            <ElementCustomizerPanel
              custom={custom}
              onChange={handleUpdateCustom}
              category={category}
              onReset={handleResetCustom}
              isDefault={isDefault}
            />
          </div>

          {/* Code pane */}
          <div className="relative flex min-h-[min(300px,46dvh)] min-w-0 flex-col bg-[#07070a] text-zinc-100 [color-scheme:dark] lg:min-h-0">
            <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2">
              <div role="tablist" aria-label="Source language" className="flex items-center gap-1.5">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "react"}
                  aria-controls="nova-code-panel"
                  id="nova-code-tab-react"
                  onClick={() => setTab("react")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors ${tab === "react" ? "bg-white/10 text-white font-semibold shadow-xs" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  <span aria-hidden className="text-cyan-400">⚛</span> React
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "css"}
                  aria-controls="nova-code-panel"
                  id="nova-code-tab-css"
                  onClick={() => setTab("css")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors ${tab === "css" ? "bg-white/10 text-white font-semibold shadow-xs" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  <span aria-hidden className="text-sky-400">◐</span> CSS
                </button>
                {!isDefault && (
                  <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10.5px] font-semibold text-accent">
                    <Sparkles size={10} /> Live Props
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={copy}
                aria-label={copied ? "Code copied to clipboard" : "Copy code to clipboard"}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11.5px] font-medium text-zinc-300 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                {copied ? <Check size={12} aria-hidden className="text-emerald-400" /> : <Copy size={12} aria-hidden />}
                <span aria-hidden>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden bg-[#07070a]">
              <pre id="nova-code-panel" tabIndex={0} role="region" aria-labelledby={tab === "react" ? "nova-code-tab-react" : "nova-code-tab-css"} aria-label={`${item.name} source code`} className="h-full min-h-[220px] overflow-auto p-5 font-mono text-[12px] leading-relaxed text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500/40 lg:min-h-0">
                <code>{source}</code>
              </pre>
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#07070a] to-transparent" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-border/60 bg-subtle/40 px-4 py-3 sm:flex sm:flex-wrap sm:px-5">
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from favorites" : "Save to favorites"}
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-1.5 text-[12.5px] font-medium text-foreground/85 transition-colors hover:border-border hover:bg-subtle"
          >
            <span aria-hidden>{saved ? "★" : "☆"}</span>
            <span aria-hidden>{saved ? "Saved" : "Save to favorites"}</span>
          </button>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Snippet copied to clipboard" : "Copy snippet to clipboard"}
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-1.5 text-[12.5px] font-medium text-foreground/85 transition-colors hover:border-border hover:bg-subtle"
          >
            <Copy size={12} aria-hidden /> <span aria-hidden>Copy snippet</span>
          </button>
          <div ref={exportRef} className="relative ml-auto">
            <button
              type="button"
              onClick={() => setExportOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={exportOpen}
              aria-label={`Export as ${tab === "react" ? "React" : "CSS"}`}
              className="inline-flex items-center overflow-hidden rounded-lg border border-border/60 bg-gradient-to-r from-fuchsia-500/80 via-violet-500/80 to-cyan-500/80 p-[1px] transition-transform hover:scale-[1.02] active:scale-[.98]"
            >
              <span className="inline-flex items-center gap-2 rounded-[7px] bg-background px-3 py-1.5 text-[12.5px] font-semibold text-foreground">
                <span aria-hidden>Export</span> <span aria-hidden className={`text-muted-foreground transition-transform ${exportOpen ? "rotate-180" : ""}`}>▾</span>
                <span aria-hidden className="ml-1 rounded-md bg-subtle px-1.5 py-0.5 text-[10.5px] text-muted-foreground">
                  {tab === "react" ? "React" : "CSS"}
                </span>
              </span>
            </button>
            {exportOpen && (
              <div
                role="menu"
                className="nova-glass absolute bottom-full right-0 mb-2 w-52 overflow-hidden rounded-lg border border-border/60 bg-background p-1 shadow-[0_20px_50px_-10px_color-mix(in_oklab,var(--foreground)_25%,transparent)] animate-in fade-in slide-in-from-bottom-1 duration-150"
              >
                <button role="menuitem" onClick={() => download("react")} className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12.5px] text-foreground/90 transition-colors hover:bg-subtle">
                  <span className="inline-flex items-center gap-2"><span className="text-cyan-400">⚛</span> React (.tsx)</span>
                  <span className="text-[10px] text-muted-foreground">JSX</span>
                </button>
                <button role="menuitem" onClick={() => download("css")} className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12.5px] text-foreground/90 transition-colors hover:bg-subtle">
                  <span className="inline-flex items-center gap-2"><span className="text-sky-400">◐</span> CSS (.css)</span>
                  <span className="text-[10px] text-muted-foreground">stylesheet</span>
                </button>
                <button role="menuitem" onClick={() => download("html")} className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12.5px] text-foreground/90 transition-colors hover:bg-subtle">
                  <span className="inline-flex items-center gap-2"><span className="text-orange-400">◧</span> Standalone (.html)</span>
                  <span className="text-[10px] text-muted-foreground">demo</span>
                </button>
                <div className="my-1 h-px bg-border/60" />
                <button role="menuitem" onClick={copy} className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12.5px] text-foreground/90 transition-colors hover:bg-subtle">
                  <span className="inline-flex items-center gap-2"><Copy size={12} /> Copy current tab</span>
                  <span className="text-[10px] text-muted-foreground">{tab === "react" ? "React" : "CSS"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes nova-modal-in {
          from { opacity: 0; transform: translateY(12px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body,
  );
}
