import { useState, useEffect, useMemo, useRef, type ReactNode } from "react";
import {
  Sliders,
  RotateCcw,
  Sparkles,
  Check,
  Type,
  Palette,
  Maximize2,
  Gauge,
  Eye,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

export type ElementCategory =
  | "button"
  | "loader"
  | "input"
  | "card"
  | "toggle"
  | "checkbox"
  | "tooltip"
  | "radio"
  | "form"
  | "pattern";

export type ElementCustomization = {
  accentName: string;
  accentColor: string;
  accentGradient: string;
  radius: "default" | "sharp" | "sm" | "md";
  scale: number;
  glow: "off" | "subtle" | "vibrant";
  speed: number;
  // Category specifics
  buttonLabel: string;
  placeholder: string;
  inputValue: string;
  cardTitle: string;
  tooltipText: string;
  tooltipPlacement: "top" | "bottom" | "left" | "right";
  isChecked: boolean;
};

export type AccentPalette = {
  id: string;
  name: string;
  label: string;
  color: string;
  gradient: string;
  spark: string;
  primaryTw: string;
  secondaryTw: string;
  primaryHex: string;
  lightHex: string;
  darkHex: string;
  glowRgba: string;
};

export const ACCENT_PALETTES: AccentPalette[] = [
  {
    id: "nebula",
    name: "Nebula",
    label: "Violet",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #7c3aed, #c026d3, #ec4899)",
    spark: "#f0abfc",
    primaryTw: "violet",
    secondaryTw: "fuchsia",
    primaryHex: "#8b5cf6",
    lightHex: "#a78bfa",
    darkHex: "#7c3aed",
    glowRgba: "rgba(139, 92, 246, 0.55)",
  },
  {
    id: "lagoon",
    name: "Lagoon",
    label: "Cyan",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4, #0ea5e9, #14b8a6)",
    spark: "#67e8f9",
    primaryTw: "cyan",
    secondaryTw: "teal",
    primaryHex: "#06b6d4",
    lightHex: "#67e8f9",
    darkHex: "#0891b2",
    glowRgba: "rgba(6, 182, 212, 0.55)",
  },
  {
    id: "sunset",
    name: "Sunset",
    label: "Coral",
    color: "#f97316",
    gradient: "linear-gradient(135deg, #f97316, #f43f5e, #e11d48)",
    spark: "#fda4af",
    primaryTw: "orange",
    secondaryTw: "rose",
    primaryHex: "#f97316",
    lightHex: "#fb923c",
    darkHex: "#ea580c",
    glowRgba: "rgba(249, 115, 22, 0.55)",
  },
  {
    id: "emerald",
    name: "Emerald",
    label: "Mint",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #059669, #10b981, #34d399)",
    spark: "#6ee7b7",
    primaryTw: "emerald",
    secondaryTw: "teal",
    primaryHex: "#10b981",
    lightHex: "#34d399",
    darkHex: "#059669",
    glowRgba: "rgba(16, 185, 129, 0.55)",
  },
  {
    id: "cosmic",
    name: "Cosmic",
    label: "Indigo",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #2563eb, #3b82f6, #60a5fa)",
    spark: "#93c5fd",
    primaryTw: "blue",
    secondaryTw: "indigo",
    primaryHex: "#3b82f6",
    lightHex: "#60a5fa",
    darkHex: "#1d4ed8",
    glowRgba: "rgba(59, 130, 246, 0.55)",
  },
  {
    id: "rose",
    name: "Rose",
    label: "Rose Pink",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #d946ef, #ec4899, #f43f5e)",
    spark: "#f472b6",
    primaryTw: "pink",
    secondaryTw: "rose",
    primaryHex: "#ec4899",
    lightHex: "#f472b6",
    darkHex: "#db2777",
    glowRgba: "rgba(236, 72, 153, 0.55)",
  },
  {
    id: "amber",
    name: "Amber",
    label: "Gold",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)",
    spark: "#fde68a",
    primaryTw: "amber",
    secondaryTw: "yellow",
    primaryHex: "#f59e0b",
    lightHex: "#fbbf24",
    darkHex: "#d97706",
    glowRgba: "rgba(245, 158, 11, 0.55)",
  },
  {
    id: "monochrome",
    name: "Monochrome",
    label: "Silver",
    color: "#e4e4e7",
    gradient: "linear-gradient(135deg, #ffffff, #d4d4d8, #71717a)",
    spark: "#ffffff",
    primaryTw: "zinc",
    secondaryTw: "neutral",
    primaryHex: "#e4e4e7",
    lightHex: "#f4f4f5",
    darkHex: "#a1a1aa",
    glowRgba: "rgba(255, 255, 255, 0.4)",
  },
];

export const RADIUS_OPTIONS = [
  { id: "default" as const, label: "Default", px: "Auto", tw: "" },
  { id: "sharp" as const, label: "Sharp", px: "0px", tw: "rounded-none" },
  { id: "sm" as const, label: "Subtle", px: "8px", tw: "rounded-lg" },
  { id: "md" as const, label: "Modern", px: "14px", tw: "rounded-xl" },
];

export const SCALE_OPTIONS = [
  { id: 0.88, label: "Compact", badge: "0.88x" },
  { id: 1.0, label: "Default", badge: "1.0x" },
  { id: 1.15, label: "Hero", badge: "1.15x" },
];

export const SPEED_OPTIONS = [
  { id: 0.5, label: "Zen", badge: "0.5x" },
  { id: 1.0, label: "Normal", badge: "1.0x" },
  { id: 2.0, label: "Fast", badge: "2.0x" },
];

export const PLACEMENT_OPTIONS = [
  { id: "top" as const, label: "Top" },
  { id: "bottom" as const, label: "Bottom" },
  { id: "left" as const, label: "Left" },
  { id: "right" as const, label: "Right" },
];

export function detectCategory(
  shareCategory?: string,
  hostAttr?: string,
  itemId?: string,
  itemName?: string,
): ElementCategory {
  const norm = (shareCategory || "").toLowerCase();
  if (norm.includes("button")) return "button";
  if (norm.includes("loader")) return "loader";
  if (norm.includes("input")) return "input";
  if (norm.includes("card") || norm.includes("kit")) return "card";
  if (norm.includes("toggle")) return "toggle";
  if (norm.includes("checkbox")) return "checkbox";
  if (norm.includes("tooltip")) return "tooltip";
  if (norm.includes("radio")) return "radio";
  if (norm.includes("form")) return "form";
  if (norm.includes("pattern")) return "pattern";

  if (hostAttr?.includes("btn")) return "button";
  if (hostAttr?.includes("ld")) return "loader";
  if (hostAttr?.includes("in")) return "input";
  if (hostAttr?.includes("cd") || hostAttr?.includes("kt")) return "card";
  if (hostAttr?.includes("tg")) return "toggle";
  if (hostAttr?.includes("cb")) return "checkbox";
  if (hostAttr?.includes("tp")) return "tooltip";
  if (hostAttr?.includes("rd")) return "radio";
  if (hostAttr?.includes("fm")) return "form";
  if (hostAttr?.includes("pt")) return "pattern";

  const lowerName = (itemName || itemId || "").toLowerCase();
  if (lowerName.includes("btn") || lowerName.includes("button")) return "button";
  if (lowerName.includes("loader") || lowerName.includes("spin")) return "loader";
  if (lowerName.includes("input") || lowerName.includes("search")) return "input";
  if (lowerName.includes("card") || lowerName.includes("dashboard")) return "card";

  return "button";
}

export function getDefaultCustomization(category: ElementCategory, initialName?: string): ElementCustomization {
  return {
    accentName: "Nebula",
    accentColor: "#8b5cf6",
    accentGradient: "linear-gradient(135deg, #7c3aed, #c026d3, #ec4899)",
    radius: "default",
    scale: 1.0,
    glow: "off",
    speed: 1.0,
    buttonLabel: "",
    placeholder: "",
    inputValue: "",
    cardTitle: "",
    tooltipText: "",
    tooltipPlacement: "top",
    isChecked: true,
  };
}

/** Check if current customization deviates from defaults */
export function hasCustomizations(current: ElementCustomization, defaults: ElementCustomization): boolean {
  return getCustomizationCount(current, defaults) > 0;
}

/** Count number of active customizations */
export function getCustomizationCount(current: ElementCustomization, defaults: ElementCustomization): number {
  let count = 0;
  if (current.accentName !== defaults.accentName) count++;
  if (current.radius !== defaults.radius) count++;
  if (current.scale !== defaults.scale) count++;
  if (current.glow !== defaults.glow) count++;
  if (current.speed !== defaults.speed) count++;
  if (Boolean(current.buttonLabel && current.buttonLabel.trim() !== defaults.buttonLabel)) count++;
  if (Boolean(current.placeholder && current.placeholder.trim() !== defaults.placeholder)) count++;
  if (Boolean(current.cardTitle && current.cardTitle.trim() !== defaults.cardTitle)) count++;
  if (Boolean(current.tooltipText && current.tooltipText.trim() !== defaults.tooltipText)) count++;
  if (current.tooltipPlacement !== defaults.tooltipPlacement) count++;
  if (current.isChecked !== defaults.isChecked) count++;
  return count;
}

const CHROMATIC_FAMILIES =
  "violet|purple|indigo|fuchsia|pink|cyan|sky|teal|emerald|green|lime|amber|orange|rose|blue";

/**
 * Transforms the code snippet dynamically with user's customized props
 */
export function generateCustomizedCode(
  originalCode: string,
  custom: ElementCustomization,
  category: ElementCategory,
): string {
  let code = originalCode;

  // 1. Button label replacement - only if user provided custom text
  if (category === "button" && custom.buttonLabel.trim()) {
    code = code.replace(
      />\s*(Get started|Deploy|Continue|Launch app|Message|Download|Explore|Button|Submit|Confirm|Send|Save|Click me)\s*</gi,
      `>${custom.buttonLabel.trim()}<`,
    );
  }

  // 2. Placeholder replacement for inputs - only if user provided custom placeholder
  if (category === "input" && custom.placeholder.trim()) {
    code = code.replace(/placeholder="[^"]*"/g, `placeholder="${custom.placeholder.trim()}"`);
  }

  // 3. Card title replacement - only if user provided custom headline
  if (category === "card" && custom.cardTitle.trim()) {
    if (/(<h[1-4][^>]*>)[^<]*(<\/h[1-4]>)/i.test(code)) {
      code = code.replace(/(<h[1-4][^>]*>)[^<]*(<\/h[1-4]>)/i, `$1${custom.cardTitle.trim()}$2`);
    } else if (/(<div[^>]*class="[^"]*(?:font-semibold|font-bold)[^"]*"[^>]*>)[^<]*(<\/div>)/i.test(code)) {
      code = code.replace(/(<div[^>]*class="[^"]*(?:font-semibold|font-bold)[^"]*"[^>]*>)[^<]*(<\/div>)/i, `$1${custom.cardTitle.trim()}$2`);
    }
  }

  // 4. Tooltip text replacement - only if user provided custom text
  if (category === "tooltip" && custom.tooltipText.trim()) {
    code = code.replace(/(<span[^>]*class="[^"]*(?:tooltip|popover)[^"]*"[^>]*>)[^<]*(<\/span>)/i, `$1${custom.tooltipText.trim()}$2`);
  }

  // 5. Radius replacement - only if explicitly changed from default
  if (["button", "input", "card", "form"].includes(category) && custom.radius !== "default") {
    const targetRadius = RADIUS_OPTIONS.find((r) => r.id === custom.radius)?.tw;
    if (targetRadius) {
      code = code.replace(/\brounded-(none|sm|md|lg|xl|2xl|3xl|full)\b/g, targetRadius);
    }
  }

  // 6. Accent theme replacement across Tailwind classes & SVG/inline colors
  const pal = ACCENT_PALETTES.find((p) => p.name === custom.accentName);
  if (pal && pal.name !== "Nebula") {
    // Replace all chromatic color classes with the selected palette
    const chromaticRegex = new RegExp(
      `\\b(bg|text|border|from|to|via|ring|shadow|outline|fill|stroke|decoration|accent)-(?:${CHROMATIC_FAMILIES})-([0-9]{2,3}(?:\\/[0-9]{1,3})?)\\b`,
      "g",
    );
    code = code.replace(chromaticRegex, `$1-${pal.primaryTw}-$2`);

    // Replace hardcoded Hex colors commonly used in gradients and SVG charts
    code = code.replace(/#8b5cf6|#7c3aed|#6d28d9|#5b21b6|#a3e635|#10b981|#06b6d4|#3b82f6/gi, pal.primaryHex);
    code = code.replace(/#a78bfa|#c4b5fd|#818cf8|#bef264|#6ee7b7|#67e8f9/gi, pal.lightHex);
    code = code.replace(/#c026d3|#d946ef|#f0abfc|#fda4af/gi, pal.spark);
    code = code.replace(
      /#ec4899|#f43f5e/gi,
      pal.secondaryTw === "teal" ? "#14b8a6" : pal.secondaryTw === "rose" ? "#f43f5e" : pal.spark,
    );
  }

  // 7. Loader speed annotation or style
  if (category === "loader" && custom.speed !== 1.0) {
    code = `/* Speed: ${custom.speed}x (apply animation-duration: calc(var(--duration) / ${custom.speed})) */\n${code}`;
  }

  return code;
}

/**
 * Interactive Live Preview Wrapper
 * Applies dynamic accent colors, radius, text, and dimensions in real time
 */
export function CustomizerPreviewWrapper({
  children,
  custom,
  category,
}: {
  children: ReactNode;
  custom: ElementCustomization;
  category: ElementCategory;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pal = useMemo(
    () => ACCENT_PALETTES.find((p) => p.name === custom.accentName) || ACCENT_PALETTES[0],
    [custom.accentName],
  );

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // 1. Accent Theme Live Application across all child DOM elements
    const allEls = root.querySelectorAll<HTMLElement>("*");
    allEls.forEach((el) => {
      // Cache original className safely across HTML and SVG elements
      if (!el.hasAttribute("data-orig-class")) {
        el.setAttribute("data-orig-class", el.getAttribute("class") || "");
      }
      // Cache original inline style
      if (!el.hasAttribute("data-orig-style")) {
        el.setAttribute("data-orig-style", el.getAttribute("style") || "");
      }
      // Cache original SVG attributes
      if (el.tagName.toLowerCase() === "stop") {
        if (!el.hasAttribute("data-orig-stop-color")) {
          el.setAttribute("data-orig-stop-color", el.getAttribute("stop-color") || "");
        }
      }
      if (el.hasAttribute("stroke")) {
        if (!el.hasAttribute("data-orig-stroke")) {
          el.setAttribute("data-orig-stroke", el.getAttribute("stroke") || "");
        }
      }
      if (el.hasAttribute("fill") && el.getAttribute("fill") !== "none") {
        if (!el.hasAttribute("data-orig-fill")) {
          el.setAttribute("data-orig-fill", el.getAttribute("fill") || "");
        }
      }

      const origClass = el.getAttribute("data-orig-class") || "";
      const origStyle = el.getAttribute("data-orig-style") || "";

      if (pal.name === "Nebula") {
        // Reset to default Nebula
        if ((el.getAttribute("class") || "") !== origClass) {
          el.setAttribute("class", origClass);
        }
        if (origStyle) el.setAttribute("style", origStyle); else el.removeAttribute("style");
        const origStop = el.getAttribute("data-orig-stop-color");
        if (origStop) el.setAttribute("stop-color", origStop);
        const origStroke = el.getAttribute("data-orig-stroke");
        if (origStroke) el.setAttribute("stroke", origStroke);
        const origFill = el.getAttribute("data-orig-fill");
        if (origFill) el.setAttribute("fill", origFill);
      } else {
        // Transform Tailwind class for any chromatic family
        const chromaticRegex = new RegExp(
          `\\b(bg|text|border|from|to|via|ring|shadow|outline|fill|stroke|decoration|accent)-(?:${CHROMATIC_FAMILIES})-([0-9]{2,3}(?:\\/[0-9]{1,3})?)\\b`,
          "g",
        );
        const nextClass = origClass.replace(chromaticRegex, `$1-${pal.primaryTw}-$2`);
        if ((el.getAttribute("class") || "") !== nextClass) {
          el.setAttribute("class", nextClass);
        }

        // Transform SVG stop-color
        const origStop = el.getAttribute("data-orig-stop-color");
        if (origStop && origStop !== "none" && origStop !== "transparent") {
          el.setAttribute("stop-color", pal.lightHex);
          if ("style" in el && el.style) el.style.stopColor = pal.lightHex;
        }

        // Transform SVG stroke
        const origStroke = el.getAttribute("data-orig-stroke");
        if (origStroke && origStroke !== "none" && origStroke !== "transparent") {
          el.setAttribute("stroke", pal.primaryHex);
          if ("style" in el && el.style) el.style.stroke = pal.primaryHex;
        }

        // Transform SVG fill
        const origFill = el.getAttribute("data-orig-fill");
        if (origFill && origFill !== "none" && origFill !== "transparent") {
          el.setAttribute("fill", pal.primaryHex);
          if ("style" in el && el.style) el.style.fill = pal.primaryHex;
        }

        // Transform inline styles
        if (origStyle && /#8b5cf6|#7c3aed|#a78bfa|#c026d3|#a3e635|#10b981|#06b6d4|#3b82f6/i.test(origStyle)) {
          const nextStyle = origStyle
            .replace(/#8b5cf6|#7c3aed|#6366f1|#a3e635/gi, pal.primaryHex)
            .replace(/#a78bfa|#c4b5fd|#bef264/gi, pal.lightHex)
            .replace(/#c026d3|#f0abfc/gi, pal.spark);
          el.setAttribute("style", nextStyle);
        }
      }
    });

    // 2. Button Label live update
    const buttonEl = root.querySelector("button, a, [role=button]");
    if (category === "button" && buttonEl) {
      if (!buttonEl.hasAttribute("data-orig-label")) {
        const walker = document.createTreeWalker(buttonEl, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const text = node.textContent?.trim();
          if (text && text.length > 0 && !/^[0-9→←↓↑⚡◈★☆]$/.test(text)) {
            buttonEl.setAttribute("data-orig-label", text);
            break;
          }
        }
      }
      const origLabel = buttonEl.getAttribute("data-orig-label") || "";
      const labelToApply = custom.buttonLabel.trim() || origLabel;
      if (labelToApply) {
        const walker = document.createTreeWalker(buttonEl, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const text = node.textContent?.trim();
          if (text && (text === origLabel || text === custom.buttonLabel.trim() || text.length > 1)) {
            node.textContent = ` ${labelToApply} `;
            break;
          }
        }
      }
    }

    // 3. Card Title / Headline live update
    if (category === "card") {
      const titleEl = root.querySelector<HTMLElement>(
        "[data-kt-title], [data-card-title], .card-title, h1, h2, h3"
      ) || (() => {
        const allCandidates = root.querySelectorAll<HTMLElement>("div.truncate[class*='font-semibold'], [class*='font-display']");
        for (const el of allCandidates) {
          const t = el.textContent?.trim() || "";
          if (!/^[+-\d$%▲▼]/.test(t) && t.length > 2) return el;
        }
        return null;
      })();

      if (titleEl) {
        if (!titleEl.hasAttribute("data-orig-title")) {
          titleEl.setAttribute("data-orig-title", titleEl.textContent || "");
        }
        const origTitle = titleEl.getAttribute("data-orig-title") || "";
        if (custom.cardTitle.trim()) {
          titleEl.textContent = custom.cardTitle;
        } else {
          titleEl.textContent = origTitle;
        }
      }
    }

    // 4. Input Placeholder live update
    if (category === "input") {
      const inputs = root.querySelectorAll<HTMLInputElement>("input, textarea");
      inputs.forEach((inp) => {
        if (!inp.hasAttribute("data-orig-placeholder")) {
          inp.setAttribute("data-orig-placeholder", inp.placeholder || "");
        }
        const origPlaceholder = inp.getAttribute("data-orig-placeholder") || "";
        inp.placeholder = custom.placeholder.trim() ? custom.placeholder : origPlaceholder;
      });
    }

    // 5. Corner Radius live update
    if (["button", "input", "card", "form"].includes(category)) {
      const targetEls = root.querySelectorAll<HTMLElement>(
        "button, a[role=button], input, textarea, select, .nova-btn, [class*='rounded-xl'], [class*='rounded-2xl'], [class*='rounded-3xl'], [class*='rounded-lg'], [data-in-hover-host], [data-btn-hover-host], [data-cd-hover-host], [data-kt-hover-host]",
      );
      targetEls.forEach((el) => {
        if (!el.hasAttribute("data-orig-border-radius")) {
          el.setAttribute("data-orig-border-radius", el.style.borderRadius || "");
        }
        const origRadius = el.getAttribute("data-orig-border-radius") || "";
        if (custom.radius === "default") {
          if (origRadius) el.style.borderRadius = origRadius;
          else el.style.removeProperty("border-radius");
        } else {
          if (el.classList?.contains("rounded-full") && (el.offsetWidth < 24 || el.offsetHeight < 24)) return;
          const radiusPx = RADIUS_OPTIONS.find((r) => r.id === custom.radius)?.px || "14px";
          el.style.borderRadius = radiusPx;
        }
      });
    }

    // 6. Loader Speed live update
    if (category === "loader") {
      const animatedEls = root.querySelectorAll<HTMLElement>("*");
      animatedEls.forEach((el) => {
        const computed = window.getComputedStyle(el);
        if (computed.animationName && computed.animationName !== "none") {
          if (!el.hasAttribute("data-orig-duration")) {
            el.setAttribute("data-orig-duration", computed.animationDuration);
          }
          const orig = parseFloat(el.getAttribute("data-orig-duration") || "1s");
          el.style.animationDuration = `${orig / custom.speed}s`;
        }
      });
    }

    // 7. Glow Effect live update
    const stage = root.firstElementChild as HTMLElement | null;
    if (stage) {
      if (custom.glow === "vibrant") {
        stage.style.filter = `drop-shadow(0 0 18px ${pal.glowRgba}) drop-shadow(0 0 32px ${pal.glowRgba})`;
      } else if (custom.glow === "subtle") {
        stage.style.filter = `drop-shadow(0 0 12px ${pal.glowRgba})`;
      } else {
        stage.style.filter = "none";
      }
    }
  }, [custom, category, pal]);

  return (
    <div
      ref={containerRef}
      className="customizer-preview-target flex items-center justify-center transition-all duration-300"
      style={{
        transform: `scale(${custom.scale})`,
        ["--accent" as any]: pal.primaryHex,
        ["--accent-color" as any]: pal.primaryHex,
        ["--accent-light" as any]: pal.lightHex,
        ["--accent-spark" as any]: pal.spark,
        ["--accent-dark" as any]: pal.darkHex,
        ["--accent-glow" as any]: pal.glowRgba,
        ["--nova-halo-mix" as any]: custom.glow === "vibrant" ? "80%" : custom.glow === "off" ? "0%" : "40%",
      }}
    >
      <style>{`
        ${pal.name !== "Nebula" ? `
          .customizer-preview-target [class*="border-lime-"],
          .customizer-preview-target [class*="border-violet-"],
          .customizer-preview-target [class*="border-purple-"],
          .customizer-preview-target [class*="border-indigo-"],
          .customizer-preview-target [class*="border-cyan-"],
          .customizer-preview-target [class*="border-emerald-"],
          .customizer-preview-target [class*="border-blue-"],
          .customizer-preview-target [class*="border-${pal.primaryTw}-"] {
            border-color: ${pal.primaryHex} !important;
          }
          .customizer-preview-target [class*="text-lime-"],
          .customizer-preview-target [class*="text-violet-"],
          .customizer-preview-target [class*="text-purple-"],
          .customizer-preview-target [class*="text-indigo-"],
          .customizer-preview-target [class*="text-cyan-"],
          .customizer-preview-target [class*="text-emerald-"],
          .customizer-preview-target [class*="text-blue-"],
          .customizer-preview-target [class*="text-${pal.primaryTw}-"] {
            color: ${pal.lightHex} !important;
          }
          .customizer-preview-target [class*="bg-lime-"],
          .customizer-preview-target [class*="bg-violet-"],
          .customizer-preview-target [class*="bg-purple-"],
          .customizer-preview-target [class*="bg-indigo-"],
          .customizer-preview-target [class*="bg-cyan-"],
          .customizer-preview-target [class*="bg-emerald-"],
          .customizer-preview-target [class*="bg-blue-"],
          .customizer-preview-target [class*="bg-${pal.primaryTw}-"] {
            background-color: ${pal.primaryHex} !important;
          }
          .customizer-preview-target [class*="from-lime-"],
          .customizer-preview-target [class*="from-violet-"],
          .customizer-preview-target [class*="from-purple-"],
          .customizer-preview-target [class*="from-${pal.primaryTw}-"] {
            --tw-gradient-from: ${pal.primaryHex} !important;
          }
          .customizer-preview-target [class*="to-fuchsia-"],
          .customizer-preview-target [class*="to-rose-"],
          .customizer-preview-target [class*="to-${pal.secondaryTw}-"] {
            --tw-gradient-to: ${pal.spark} !important;
          }
          .customizer-preview-target [class*="bg-fuchsia-"],
          .customizer-preview-target [class*="bg-${pal.secondaryTw}-"] {
            background-color: ${pal.spark} !important;
          }
        ` : ""}
      `}</style>
      {children}
    </div>
  );
}

/**
 * High-End Studio Customization Control Panel
 * Refined with Linear / Figma dock ergonomics, rich palettes, segmented pills, and live indicators.
 */
export function ElementCustomizerPanel({
  custom,
  onChange,
  category,
  onReset,
  isDefault,
}: {
  custom: ElementCustomization;
  onChange: (patch: Partial<ElementCustomization>) => void;
  category: ElementCategory;
  onReset: () => void;
  isDefault: boolean;
}) {
  const [expanded, setExpanded] = useState(true);

  // Category-specific visibility
  const showLabelInput = category === "button" || category === "form";
  const showPlaceholderInput = category === "input";
  const showCardTitleInput = category === "card";
  const showTooltipInput = category === "tooltip";
  const showColorPicker = true;
  const showRadiusPicker = ["button", "input", "card", "form"].includes(category);
  const showScalePicker = ["button", "loader", "toggle", "checkbox", "radio"].includes(category);
  const showSpeedPicker = category === "loader";
  const showGlowPicker = ["button", "loader", "card"].includes(category);
  const showPlacementPicker = category === "tooltip";
  const showCheckedToggle = category === "toggle" || category === "checkbox";

  const defaultValues = useMemo(() => getDefaultCustomization(category), [category]);
  const changeCount = useMemo(() => getCustomizationCount(custom, defaultValues), [custom, defaultValues]);
  const activePalette = useMemo(
    () => ACCENT_PALETTES.find((p) => p.name === custom.accentName) || ACCENT_PALETTES[0],
    [custom.accentName],
  );

  return (
    <div className="relative border-t border-white/[0.08] bg-[#0b0b0f]/95 backdrop-blur-2xl transition-all duration-300">
      {/* Ambient hairline glow on top edge */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px transition-colors duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${activePalette.color}60, transparent)`,
        }}
      />

      {/* Studio Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className="grid size-6 place-items-center rounded-lg border border-white/10 shadow-xs transition-colors duration-300"
            style={{
              background: `linear-gradient(135deg, ${activePalette.color}25, ${activePalette.spark}15)`,
              color: activePalette.color,
            }}
          >
            <Sliders size={12} aria-hidden />
          </div>
          <span className="text-[12.5px] font-semibold tracking-tight text-white">Element Studio</span>
          <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10.5px] font-medium text-white/70 sm:inline-flex">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            {category.charAt(0).toUpperCase() + category.slice(1)} Mode
          </span>
          {!isDefault && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold transition-all duration-300"
              style={{
                background: `${activePalette.color}20`,
                color: activePalette.lightHex,
                border: `1px solid ${activePalette.color}40`,
              }}
            >
              <Sparkles size={10} /> {changeCount} {changeCount === 1 ? "tweak" : "tweaks"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isDefault && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <RotateCcw size={11} /> Reset
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse customizer" : "Expand customizer"}
            className="grid size-7 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded Controls Drawer */}
      {expanded && (
        <div className="border-t border-white/[0.05] p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* 1. Accent Theme Palette */}
            {showColorPicker && (
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-[11px] font-medium text-white/70">
                    <Palette size={12} style={{ color: activePalette.color }} /> Accent Theme
                  </label>
                  <span className="font-mono text-[10px] text-white/50">
                    {activePalette.name} · {activePalette.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  {ACCENT_PALETTES.map((pal) => {
                    const isSel = custom.accentName === pal.name;
                    return (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() =>
                          onChange({
                            accentName: pal.name,
                            accentColor: pal.color,
                            accentGradient: pal.gradient,
                          })
                        }
                        title={`${pal.name} (${pal.label})`}
                        className={`group relative grid size-7 place-items-center rounded-full transition-all duration-200 focus:outline-none ${
                          isSel
                            ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0b0b0f]"
                            : "opacity-80 hover:scale-105 hover:opacity-100"
                        }`}
                        style={{
                          background: pal.gradient,
                          boxShadow: isSel ? `0 0 14px ${pal.glowRgba}` : undefined,
                        }}
                      >
                        {isSel && <Check size={12} className="text-white drop-shadow-md" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Corner Radius Segmented Control */}
            {showRadiusPicker && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-[11px] font-medium text-white/70">
                    <Sparkles size={12} /> Corner Radius
                  </label>
                  <span className="font-mono text-[10px] text-white/40">
                    {RADIUS_OPTIONS.find((r) => r.id === custom.radius)?.px}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
                  {RADIUS_OPTIONS.map((r) => {
                    const isSel = custom.radius === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => onChange({ radius: r.id })}
                        className={`rounded-lg py-1 text-center text-[11px] font-medium transition-all ${
                          isSel
                            ? "border border-white/15 bg-white/[0.14] font-semibold text-white shadow-xs"
                            : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Glow Intensity Segmented Control */}
            {showGlowPicker && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-[11px] font-medium text-white/70">
                    <Sparkles size={12} /> Glow Effect
                  </label>
                  <span className="font-mono text-[10px] capitalize text-white/40">{custom.glow}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
                  {(["off", "subtle", "vibrant"] as const).map((g) => {
                    const isSel = custom.glow === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => onChange({ glow: g })}
                        className={`rounded-lg py-1 text-center text-[11px] font-medium capitalize transition-all ${
                          isSel
                            ? "border border-white/15 bg-white/[0.14] font-semibold text-white shadow-xs"
                            : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Text Label (Buttons / Forms) */}
            {showLabelInput && (
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-white/70">
                  <Type size={12} /> Button Label
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={custom.buttonLabel}
                    onChange={(e) => onChange({ buttonLabel: e.target.value })}
                    placeholder="Custom button text..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white placeholder-white/30 transition-all focus:border-accent/60 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                  {Boolean(custom.buttonLabel) && (
                    <button
                      type="button"
                      onClick={() => onChange({ buttonLabel: "" })}
                      className="absolute right-2 text-white/40 hover:text-white"
                      title="Reset label"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 5. Card Title / Headline (Cards & Kits) */}
            {showCardTitleInput && (
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-white/70">
                  <Type size={12} /> Card Headline
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={custom.cardTitle}
                    onChange={(e) => onChange({ cardTitle: e.target.value })}
                    placeholder="Custom headline..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white placeholder-white/30 transition-all focus:border-accent/60 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                  {Boolean(custom.cardTitle) && (
                    <button
                      type="button"
                      onClick={() => onChange({ cardTitle: "" })}
                      className="absolute right-2 text-white/40 hover:text-white"
                      title="Reset headline"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 6. Placeholder Input (Inputs) */}
            {showPlaceholderInput && (
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-white/70">
                  <Type size={12} /> Placeholder
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={custom.placeholder}
                    onChange={(e) => onChange({ placeholder: e.target.value })}
                    placeholder="Custom placeholder..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white placeholder-white/30 transition-all focus:border-accent/60 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                  {Boolean(custom.placeholder) && (
                    <button
                      type="button"
                      onClick={() => onChange({ placeholder: "" })}
                      className="absolute right-2 text-white/40 hover:text-white"
                      title="Reset placeholder"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 7. Scale Control */}
            {showScalePicker && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-[11px] font-medium text-white/70">
                    <Maximize2 size={12} /> Dimension Scale
                  </label>
                  <span className="font-mono text-[10px] text-white/40">{custom.scale}x</span>
                </div>
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
                  {SCALE_OPTIONS.map((sc) => {
                    const isSel = custom.scale === sc.id;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => onChange({ scale: sc.id })}
                        className={`rounded-lg py-1 text-center text-[11px] font-medium transition-all ${
                          isSel
                            ? "border border-white/15 bg-white/[0.14] font-semibold text-white shadow-xs"
                            : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        {sc.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 8. Speed Control (Loaders) */}
            {showSpeedPicker && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-[11px] font-medium text-white/70">
                    <Gauge size={12} /> Animation Speed
                  </label>
                  <span className="font-mono text-[10px] text-white/40">{custom.speed}x</span>
                </div>
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
                  {SPEED_OPTIONS.map((sp) => {
                    const isSel = custom.speed === sp.id;
                    return (
                      <button
                        key={sp.id}
                        type="button"
                        onClick={() => onChange({ speed: sp.id })}
                        className={`rounded-lg py-1 text-center text-[11px] font-medium transition-all ${
                          isSel
                            ? "border border-white/15 bg-white/[0.14] font-semibold text-white shadow-xs"
                            : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        {sp.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 9. Tooltip Placement */}
            {showPlacementPicker && (
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-white/70">
                  <Eye size={12} /> Tooltip Placement
                </label>
                <div className="grid grid-cols-4 gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
                  {PLACEMENT_OPTIONS.map((pos) => {
                    const isSel = custom.tooltipPlacement === pos.id;
                    return (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => onChange({ tooltipPlacement: pos.id })}
                        className={`rounded-lg py-1 text-center text-[11px] font-medium transition-all ${
                          isSel
                            ? "border border-white/15 bg-white/[0.14] font-semibold text-white shadow-xs"
                            : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        {pos.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 10. Active State Toggle (Toggles & Checkboxes) */}
            {showCheckedToggle && (
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-white/70">
                  <Eye size={12} /> Active State
                </label>
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
                  <button
                    type="button"
                    onClick={() => onChange({ isChecked: true })}
                    className={`rounded-lg py-1 text-center text-[11px] font-medium transition-all ${
                      custom.isChecked
                        ? "border border-emerald-500/40 bg-emerald-500/20 font-semibold text-emerald-300 shadow-xs"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    Active / On
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ isChecked: false })}
                    className={`rounded-lg py-1 text-center text-[11px] font-medium transition-all ${
                      !custom.isChecked
                        ? "border border-white/20 bg-white/15 font-semibold text-white shadow-xs"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    Inactive / Off
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Studio Footer Micro-Bar */}
          <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-2 text-[10.5px] text-white/40">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-accent" />
              Live Sync: changes reflect simultaneously in preview & source code tabs
            </span>
            <span className="hidden font-mono text-[10px] text-white/30 sm:inline">
              Preset: {activePalette.primaryTw} · {custom.radius} · {custom.glow}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
