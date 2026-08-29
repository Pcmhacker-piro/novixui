// @ts-nocheck — Storybook stories; typechecked by Storybook, not the app build.
import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { BUTTONS } from "@/data/buttons";
import { CHECKBOXES } from "@/data/checkboxes";
import { TOGGLES } from "@/data/toggles";
import { CARDS } from "@/data/cards";
import { LOADERS } from "@/data/loaders";
import { RADIOS } from "@/data/radios";
import { TOOLTIPS } from "@/data/tooltips";
import { INPUTS } from "@/data/inputs";
import { FORMS } from "@/data/forms";
import { PATTERNS } from "@/data/patterns";
import { KITS } from "@/data/kits";

/**
 * Card vs Modal Parity
 * -------------------------------------------------
 * Renders the SAME item twice:
 *   • left  — the "card tile" wrapper (as it appears in the /elements grid)
 *   • right — the "modal preview" wrapper (as it appears inside CodeModal)
 *
 * Any spacing, padding, or alignment drift is instantly visible side-by-side.
 * A red centerline overlay marks the geometric center of each pane so you
 * can eyeball optical alignment too. Toggle the alignment guides off if
 * they get in the way.
 */

type Category = {
  key: string;
  label: string;
  hostAttr: string | null;
  items: { id: string; name: string; render: () => React.ReactNode }[];
  natural: { width: number; height: number };
};

const CATEGORIES: Category[] = [
  { key: "buttons",    label: "Buttons",       hostAttr: null,                    items: BUTTONS,    natural: { width: 420, height: 288 } },
  { key: "checkboxes", label: "Checkboxes",    hostAttr: "data-cb-hover-host",    items: CHECKBOXES, natural: { width: 420, height: 288 } },
  { key: "toggles",    label: "Toggles",       hostAttr: "data-tg-hover-host",    items: TOGGLES,    natural: { width: 420, height: 288 } },
  { key: "cards",      label: "Cards",         hostAttr: "data-cd-hover-host",    items: CARDS,      natural: { width: 420, height: 288 } },
  { key: "loaders",    label: "Loaders",       hostAttr: "data-ld-hover-host",    items: LOADERS,    natural: { width: 420, height: 288 } },
  { key: "radios",     label: "Radio buttons", hostAttr: "data-rd-hover-host",    items: RADIOS,     natural: { width: 420, height: 288 } },
  { key: "tooltips",   label: "Tooltips",      hostAttr: "data-tp-hover-host",    items: TOOLTIPS,   natural: { width: 420, height: 288 } },
  { key: "inputs",     label: "Inputs",        hostAttr: "data-in-hover-host",    items: INPUTS,     natural: { width: 420, height: 288 } },
  { key: "forms",      label: "Forms",         hostAttr: "data-fm-hover-host",    items: FORMS,      natural: { width: 420, height: 288 } },
  { key: "patterns",   label: "Patterns",      hostAttr: "data-pt-hover-host",    items: PATTERNS,   natural: { width: 420, height: 288 } },
  { key: "kits",       label: "UI Kits",       hostAttr: "data-kt-hover-host",    items: KITS,       natural: { width: 720, height: 420 } },
];

/** Card-tile wrapper — mirrors <MiniTile>/<ButtonCard>/<KitCard>'s outer shell. */
function TileWrapper({ hostAttr, children }: { hostAttr: string | null; children: React.ReactNode }) {
  const hostProps: Record<string, string> = hostAttr ? { [hostAttr]: "" } : {};
  return (
    <div
      {...hostProps}
      className="group relative flex min-h-72 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-[#0f0f10] to-[#050505] px-6 py-8 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.7)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <div className="relative z-10 flex w-full items-center justify-center">{children}</div>
    </div>
  );
}

/** Modal-preview wrapper — mirrors CodeModal's stage (flush padding, scale-to-fit). */
function ModalPreviewWrapper({
  hostAttr,
  natural,
  children,
}: {
  hostAttr: string | null;
  natural: { width: number; height: number };
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex h-full min-h-0 w-full justify-center overflow-auto overscroll-contain rounded-2xl border border-white/8 bg-gradient-to-b from-[#0f0f10] to-[#050505] p-3 sm:p-4">
      <div className="mx-auto shrink-0" style={{ width: natural.width, height: natural.height }}>
        <div
          className="origin-top-left [&>*]:w-full"
          style={{ width: natural.width, transform: "scale(1)" }}
        >
          <TileWrapper hostAttr={hostAttr}>{children}</TileWrapper>
        </div>
      </div>
    </div>
  );
}

function CenterlineOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-red-500/40" />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-red-500/40" />
    </>
  );
}

function ParityBoard({
  categoryKey,
  itemId,
  guides,
}: {
  categoryKey: string;
  itemId?: string;
  guides: boolean;
}) {
  const category = CATEGORIES.find((c) => c.key === categoryKey) ?? CATEGORIES[0];
  const items = category.items;
  const [id, setId] = useState<string>(itemId ?? items[0]?.id ?? "");
  const item = useMemo(() => items.find((x) => x.id === id) ?? items[0], [items, id]);
  if (!item) return <div style={{ color: "#fff" }}>No items in this category.</div>;

  return (
    <div style={{ background: "#050505", padding: 24, minHeight: "100vh", color: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <strong style={{ fontFamily: "system-ui" }}>{category.label}</strong>
        <select
          value={item.id}
          onChange={(e) => setId(e.target.value)}
          style={{ background: "#111", color: "#fff", border: "1px solid #333", borderRadius: 6, padding: "6px 10px" }}
        >
          {items.slice(0, 200).map((it) => (
            <option key={it.id} value={it.id}>{it.name}</option>
          ))}
        </select>
        <span style={{ opacity: 0.5, fontFamily: "system-ui", fontSize: 12 }}>
          {items.length} item{items.length === 1 ? "" : "s"} • natural {category.natural.width}×{category.natural.height}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <div>
          <div style={{ fontFamily: "system-ui", fontSize: 12, opacity: 0.6, marginBottom: 8 }}>
            Card tile (as rendered in /elements grid)
          </div>
          <div style={{ position: "relative", width: category.natural.width, maxWidth: "100%" }}>
            <TileWrapper hostAttr={category.hostAttr}>{item.render()}</TileWrapper>
            <CenterlineOverlay show={guides} />
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "system-ui", fontSize: 12, opacity: 0.6, marginBottom: 8 }}>
            Modal preview (as rendered in CodeModal)
          </div>
          <div style={{ position: "relative", width: category.natural.width, maxWidth: "100%" }}>
            <ModalPreviewWrapper hostAttr={category.hostAttr} natural={category.natural}>
              {item.render()}
            </ModalPreviewWrapper>
            <CenterlineOverlay show={guides} />
          </div>
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof ParityBoard> = {
  title: "QA/Card vs Modal Parity",
  component: ParityBoard,
  parameters: { layout: "fullscreen" },
  args: { categoryKey: "buttons", guides: true },
  argTypes: {
    categoryKey: {
      control: { type: "select" },
      options: CATEGORIES.map((c) => c.key),
      description: "Element category to inspect",
    },
    itemId: { control: "text", description: "Optional starting item id" },
    guides: { control: "boolean", description: "Toggle red centerline overlays" },
  },
};
export default meta;

type Story = StoryObj<typeof ParityBoard>;

export const Buttons: Story    = { args: { categoryKey: "buttons"    } };
export const Checkboxes: Story = { args: { categoryKey: "checkboxes" } };
export const Toggles: Story    = { args: { categoryKey: "toggles"    } };
export const Cards: Story      = { args: { categoryKey: "cards"      } };
export const Loaders: Story    = { args: { categoryKey: "loaders"    } };
export const Radios: Story     = { args: { categoryKey: "radios"     } };
export const Tooltips: Story   = { args: { categoryKey: "tooltips"   } };
export const Inputs: Story     = { args: { categoryKey: "inputs"     } };
export const Forms: Story      = { args: { categoryKey: "forms"      } };
export const Patterns: Story   = { args: { categoryKey: "patterns"   } };
export const Kits: Story       = { args: { categoryKey: "kits"       } };
