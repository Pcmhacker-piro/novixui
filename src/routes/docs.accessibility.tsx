import { createFileRoute } from "@tanstack/react-router";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/accessibility")({
  component: A11yPage,
  head: () => ({
    meta: [
      { title: "Accessibility · Novix UI" },
      { name: "description", content: "Novix UI is designed to be usable by everyone. WCAG 2.2 AA baseline, Radix primitives, and keyboard-tested interactions." },
      { property: "og:title", content: "Accessibility · Novix UI" },
      { property: "og:description", content: "Accessibility contracts, ARIA patterns, and testing guidance for Novix UI." },
    ],
  }),
});

function A11yPage() {
  return (
    <DocsShell
      eyebrow="Getting started"
      title="Accessibility"
      description="Nova treats accessibility as a design constraint, not a compliance task. Every component ships with an accessibility contract we test against — not an aspirational note."
      toc={[
        { id: "baseline", label: "Baseline" },
        { id: "keyboard", label: "Keyboard" },
        { id: "aria", label: "ARIA patterns" },
        { id: "motion", label: "Reduced motion" },
        { id: "focus", label: "Focus visibility" },
        { id: "color", label: "Color & contrast" },
        { id: "forms", label: "Forms & errors" },
        { id: "screen-readers", label: "Screen readers" },
        { id: "testing", label: "Testing" },
      ]}
    >
      <DocSection id="baseline" title="Baseline commitments">
        <DocLead>
          Every stable component meets or exceeds WCAG 2.2 AA. Interactive primitives are built on Radix UI where semantics matter, and every custom widget is verified with axe-core in CI.
        </DocLead>
        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
          {[
            "Color contrast ≥ 4.5:1 for body text, 3:1 for large text and UI.",
            "Every icon-only control has an aria-label. IconButton enforces it at the type level.",
            "Form inputs always have a semantic <label>, not a placeholder-as-label.",
            "Live regions announce async status (loading, saved, error).",
            "Every overlay traps focus, restores it on close, and closes on Escape.",
            "Every primitive is reachable with a keyboard alone — no mouse-only affordances.",
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard navigation">
        <p className="leading-relaxed text-muted-foreground">
          Tab moves between controls, arrow keys move within composite widgets, Enter/Space activates, and Escape closes overlays. Focus is trapped in modals and restored on close.
        </p>
        <div className="mt-5 overflow-x-auto rounded-xl border border-border/70">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-subtle/60">
              <tr>
                <th className="px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Key</th>
                <th className="px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Behavior</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Tab / Shift+Tab", "Move to next / previous focusable control"],
                ["Enter", "Activate buttons, submit forms"],
                ["Space", "Activate buttons, toggle checkboxes"],
                ["Arrow keys", "Navigate within radio groups, menus, tabs, sliders"],
                ["Escape", "Close overlays, cancel edits"],
                ["Home / End", "Jump to first / last item in a list or slider"],
              ].map(([k, b], i) => (
                <tr key={k} className={i > 0 ? "border-t border-border/60" : ""}>
                  <td className="px-4 py-2 font-mono text-[12.5px]">{k}</td>
                  <td className="px-4 py-2 text-muted-foreground">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="aria" title="ARIA patterns">
        <p className="leading-relaxed text-muted-foreground">
          Nova follows the WAI-ARIA Authoring Practices for every composite widget. When Radix provides a primitive with the right pattern, we use it — reinventing ARIA state machines is where accessibility bugs are born.
        </p>
        <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
          <li><span className="font-medium text-fg">Dialogs</span> use role="dialog" with aria-modal="true" and aria-labelledby pointing at the title.</li>
          <li><span className="font-medium text-fg">Menus</span> use role="menu" with roving tabindex, arrow-key navigation, and typeahead.</li>
          <li><span className="font-medium text-fg">Tabs</span> use role="tablist"/"tab"/"tabpanel" with aria-selected and aria-controls wired in.</li>
          <li><span className="font-medium text-fg">Disclosure</span> patterns use aria-expanded and aria-controls on the trigger.</li>
          <li><span className="font-medium text-fg">Toasts</span> use role="status" for informational and role="alert" for urgent.</li>
        </ul>
      </DocSection>

      <DocSection id="motion" title="Reduced motion">
        <p className="leading-relaxed text-muted-foreground">
          Nova respects <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">prefers-reduced-motion</code>. Decorative motion (aurora drifts, shimmers) is held. Meaningful motion (spinners, progress) is preserved but slowed.
        </p>
        <CodeBlock
          className="mt-5"
          language="css"
          code={`@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.001ms !important;\n    transition-duration: 0.001ms !important;\n  }\n}`}
        />
        <Callout className="mt-4" variant="accessibility" title="Guideline">
          Never gate critical feedback behind an animation. If a state change only becomes visible after 300ms of easing, the user with reduced motion won't see it at all.
        </Callout>
      </DocSection>

      <DocSection id="focus" title="Focus visibility">
        <p className="leading-relaxed text-muted-foreground">
          Focus rings are two-layer — an inner ring in the background color, an outer ring in the accent — so focus stays visible on any surface, light or dark. Never suppress <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">:focus-visible</code> in an app that uses Nova.
        </p>
      </DocSection>

      <DocSection id="color" title="Color & contrast">
        <p className="leading-relaxed text-muted-foreground">
          Nova's OKLCH token system is contrast-audited on both themes. Semantic pairs (fg on bg, muted-fg on subtle, accent on bg) meet WCAG AA at every combination we ship. If you author a custom theme, run the CLI's contrast checker before shipping.
        </p>
        <Callout className="mt-4" variant="best-practice" title="Never encode meaning in color alone">
          Pair red with an icon and text label. Users with color-vision differences and users on grayscale devices deserve the same clarity.
        </Callout>
      </DocSection>

      <DocSection id="forms" title="Forms & error messaging">
        <p className="leading-relaxed text-muted-foreground">
          Every input needs a <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">&lt;Label&gt;</code>. Error messages are linked with <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">aria-describedby</code> and the input carries <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">aria-invalid="true"</code> when the field fails validation.
        </p>
        <CodeBlock
          className="mt-4"
          code={`<Label htmlFor="email">Email</Label>\n<Input\n  id="email"\n  aria-invalid={hasError}\n  aria-describedby={hasError ? "email-error" : undefined}\n/>\n{hasError && (\n  <p id="email-error" role="alert" className="text-danger text-sm">\n    Enter a valid email address.\n  </p>\n)}`}
        />
      </DocSection>

      <DocSection id="screen-readers" title="Screen readers">
        <p className="leading-relaxed text-muted-foreground">
          Nova is verified against VoiceOver (macOS/iOS), NVDA (Windows), and TalkBack (Android). Live regions are used sparingly — only for status the user needs to hear without shifting focus.
        </p>
      </DocSection>

      <DocSection id="testing" title="Testing checklist">
        <ul className="mt-2 space-y-3 text-sm text-muted-foreground">
          {[
            "Navigate the entire flow with a keyboard only. Every action must be reachable.",
            "Run axe-core (or Lighthouse) against the page — zero violations before merging.",
            "Enable prefers-reduced-motion in the OS and verify decorative motion is held.",
            "Zoom to 200% — no clipped content, no horizontal scroll on standard breakpoints.",
            "Test with a screen reader: does every button announce its purpose without visual context?",
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocsShell>
  );
}
