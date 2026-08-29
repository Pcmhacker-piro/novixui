# CodeModal — Accessibility Contract

Status: **Stable** · Source: `src/routes/elements.tsx` (`CodeModal`) · Tests: `tests/visual/code-modal-a11y.py`, `tests/visual/get-code-modal-motion.py`

The `CodeModal` is the dialog that opens from every element's **Get code** button in the Novix UI Elements gallery. It combines a live preview with a copy-ready code panel and must behave like a first-class modal for keyboard and screen-reader users. This document is the canonical accessibility contract; any change to `CodeModal` must keep every guarantee below intact.

---

## 1. Roles & Semantics

| Region | Role / Attribute | Notes |
|---|---|---|
| Dialog root | `role="dialog"`, `aria-modal="true"` | Rendered as an overlay above the gallery. Body scroll is locked while open. |
| Accessible name | `aria-labelledby` → visible heading id | The dialog name is announced from on-screen text; never a hidden string. |
| Framework switcher | `role="tablist"` with `role="tab"` children | Each tab exposes `aria-selected` and `aria-controls` pointing at the code panel. |
| Code panel | `role="tabpanel"` with matching `aria-labelledby` | Mirrors the currently selected tab. |
| Preview theme toggles | Wrapped in `role="group"`; buttons expose `aria-pressed` | Communicates which theme (light/dark) is active. |
| Copy button | `aria-label` updates between “Copy code” and “Copied” | State change is announced without moving focus. |
| Export split-button | `aria-haspopup="menu"`, `aria-expanded` reflects menu state | Menu itself uses `role="menu"` / `role="menuitem"`. |
| Decorative glyphs | `aria-hidden="true"` | Icons, sparkles, and symbols (☾, ☀, ★, 🔗, etc.) are hidden from AT. |
| Buttons | Every control sets `type="button"` | Prevents accidental form submission when the modal is embedded. |

---

## 2. Focus Behavior

1. **Initial focus** lands on the **Close** button.
   - Implemented via `closeBtnRef` with a retry loop (up to 5 RAFs) so focus survives ref commit timing and entrance animation.
   - Fallback: the first focusable element inside the dialog if the Close button cannot be resolved.
   - A 200 ms safety check pulls focus back to Close if the entrance animation displaced it.
2. **Focus trap** — `Tab` and `Shift+Tab` cycle only within the dialog. The trap is scoped to the dialog root; controls outside (page, gallery, header) are unreachable while open.
3. **Focus return** — closing the dialog restores focus to the originating **Get code** trigger. If the trigger unmounted, focus falls back to `document.body` and the router announces the route.
4. **Menus inside the dialog** (export split-button) manage their own roving focus and do not escape the trap.

---

## 3. Keyboard Shortcuts

Complete set of key bindings the dialog honors while open. Every row here is enforced by `tests/visual/code-modal-a11y.py` and `tests/integration/code-modal-download.py` unless marked *native*. When multiple bindings can fire from the same event, the row order below is the resolution order (top wins).

### 3.1 Dialog lifecycle

| Key | Context | Behavior |
|---|---|---|
| `Esc` | Export menu is open | Closes the menu only; dialog stays open; focus returns to the Export split-button. |
| `Esc` | Any other focus inside the dialog | Closes the dialog and restores focus to the originating **Get code** trigger. |
| `Esc` | Confirm-close prompt visible (future) | Dismisses the prompt without closing the dialog. |

### 3.2 In-modal navigation

| Key | Context | Behavior |
|---|---|---|
| `Tab` | Anywhere in the dialog | Moves focus to the next focusable control inside the dialog; wraps to the first control after the last. |
| `Shift+Tab` | Anywhere in the dialog | Moves focus to the previous focusable control; wraps to the last after the first. |
| `←` / `→` | Focus on framework tablist | Moves between framework tabs; the newly focused tab is activated automatically and updates the code panel. |
| `Home` / `End` | Focus on framework tablist | Jumps to the first / last tab and activates it. |
| `↑` / `↓` | Focus on export menu | Roving focus through menu items (`React`, `CSS`, `Standalone HTML`). Wraps at both ends. |
| `Home` / `End` | Focus on export menu | Jumps to the first / last menu item. |

### 3.3 Activation

| Key | Context | Behavior |
|---|---|---|
| `Enter` | Focus on Close, Copy, Save-to-favorites, Export split-button, or menu item | Activates the control. Same effect as a mouse click. |
| `Space` | Focus on any button, tab, or menu item | Activates the control. Toggle controls (theme, favorite) flip their pressed state. |
| `Enter` / `Space` | Focus on a framework tab | Explicitly activates the tab even though arrow-key focus already auto-activates. |

### 3.4 Content & clipboard

| Key | Context | Behavior |
|---|---|---|
| `Cmd/Ctrl+C` *native* | Text selection inside the code panel | Native copy of the selection. The **Copy snippet** button remains the primary path and works without a selection. |
| `Cmd/Ctrl+A` *native* | Focus inside the code panel | Selects the panel contents for native copy. |
| Page scroll keys *native* | Focus inside the code panel | `↑` / `↓` / `PageUp` / `PageDown` scroll the code panel when it overflows. Horizontal `←` / `→` scroll long lines. |

The global `Cmd/Ctrl+K` command bar is suppressed while the dialog is open so its shortcuts do not collide with in-dialog navigation. See §2 for the underlying focus trap that scopes every binding above to the dialog root.

---

## 4. Reduced-Motion Considerations

`CodeModal` respects `prefers-reduced-motion: reduce`.

- Entrance/exit transitions collapse to an opacity-only fade; no scale, translate, or spring physics.
- The 3D tilt, halo hover, and press-sink signatures on the underlying `MosaicCard` are disabled while the dialog is open regardless of the user preference, so the preview stays pixel-stable.
- The preview area uses a `ResizeObserver`-driven **Scale-to-Fit** that runs synchronously; it does not animate, so reduced-motion users get identical layout to the default mode.
- Visual parity between `no-preference` and `reduce` is enforced by `tests/visual/get-code-modal-motion.py`, which diffs both modes per category.

---

## 5. Screen-Reader Expectations

Verified against NVDA (Firefox), VoiceOver (Safari), and Orca (Firefox) via the automated assertions in `tests/visual/code-modal-a11y.py`:

- Opening the dialog announces its accessible name (from `aria-labelledby`) plus “dialog”.
- Switching frameworks announces the new tab and reads the updated code panel label.
- Toggling the preview theme announces the pressed state.
- Activating **Copy** announces the state change (“Copied”) without stealing focus.
- Opening the export menu announces expanded state; the first `Esc` announces the menu collapse; a second `Esc` closes the dialog.
- Closing the dialog announces focus return to the originating trigger (“Get code, button”).

---

## 6. Component Props

`CodeModal` is exported from `src/routes/elements.tsx`. Every prop below either feeds the accessibility contract in §1–§5 or is fully governed by the keyboard model in §3 — see the linked section on each row before changing a default.

```ts
type CodeModalItem = {
  id: string;           // stable id; feeds `aria-labelledby` (§1)
  name: string;         // visible dialog title + download filename slug
  code?: string;        // React/TSX source shown in the code panel
  render: () => ReactNode; // live preview node
};

interface CodeModalProps {
  item: CodeModalItem;
  onClose: () => void;
  shareCategory?: string;
  hostAttr?: string;
  preview?: ReactNode;
}
```

| Prop | Type | Required | Default | Behavior & a11y contract |
|---|---|---|---|---|
| `item` | `CodeModalItem` | ✔ | — | Drives the dialog name via `aria-labelledby={code-modal-title-<item.id>}` (§1) and the download filename slug used by the Export menu (§3.3, §3.4). Changing `item.name` renames the announced dialog. |
| `onClose` | `() => void` | ✔ | — | Fired by the Close button, backdrop click, and every `Esc` binding in §3.1. Must restore focus to the originating trigger (§2). Do not call synchronously from render — the focus-return contract depends on it firing after the current event loop. |
| `shareCategory` | `string` | — | `undefined` | Appended to the shareable deep link the copy-link button writes to the clipboard. Purely informational; no keyboard binding beyond the standard `Enter` / `Space` activation in §3.3. |
| `hostAttr` | `string` | — | `undefined` | Data attribute stamped on the preview wrapper for tests and analytics. Does not affect focus, semantics, or any shortcut in §3. |
| `preview` | `ReactNode` | — | Rendered from `item.render()` | Overrides the default preview node. If supplied, it must remain non-focusable at the root (or manage its own trap) so the dialog-scoped shortcuts in §3.2 keep working. |

Internal state (`copied`, `linkCopied`, `tab`, `light`, `saved`, `exportOpen`) is not exposed; each is wired to the corresponding ARIA state described in §1 and toggled by the keys in §3.3.

---

## 7. Regression Coverage

| Suite | File | Guarantees |
|---|---|---|
| Keyboard & focus | `tests/visual/code-modal-a11y.py` | Initial focus, Tab/Shift+Tab trap, Escape hierarchy, tab semantics, export menu dismissal, accessible name. 4/4 categories × 11 assertions. |
| Reduced motion parity | `tests/visual/reduced-motion-parity.py` | Layout and spacing match between motion modes. |
| Get code button parity | `tests/visual/get-code-modal-motion.py` | Modal preview and code panel render identically across motion modes. |
| Copy button contract | `tests/visual/code-modal-copy.py` | `Cmd/Ctrl+C` native path + Copy button state announcements (§3.4). |
| Download integration | `tests/integration/code-modal-download.py` | Export menu keybindings (§3.2) and filename/contents contract from `item.name` (§6). |

Any PR touching `CodeModal`, `MosaicCard`, or the Elements gallery must run these suites and attach the generated report in `tests/visual/out-*/report.md` or `tests/integration/out-*/report.md`.


---

## 7. Do / Don't

**Do**
- Keep every icon-only control labeled via `aria-label` and route decorative glyphs through `aria-hidden`.
- Update `aria-pressed` / `aria-selected` / `aria-expanded` in the same render as the visual state.
- Preserve the Close-button initial focus contract when refactoring the mount effect.

**Don't**
- Introduce animations that move layout on entrance; parity tests will fail.
- Add global shortcuts that fire while the dialog is open without checking the dialog-open flag.
- Replace the focus trap with `autoFocus` — the retry-based effect exists because entrance animation and Framer Motion presence timing break naive `autoFocus`.
