import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { CodeBlock } from "@/components/docs/code-block";
import { Check, Copy } from "lucide-react";

export const Route = createFileRoute("/docs/tokens/motion")({
  component: MotionPage,
  head: () => ({
    meta: [
      { title: "Motion · Novix UI" },
      { name: "description", content: "Spring physics tuned per interaction. Novix UI's motion system is opinionated, purposeful, and reduced-motion-aware." },
      { property: "og:title", content: "Motion · Novix UI" },
      { property: "og:description", content: "Spring physics tuned per interaction. Novix UI's motion system is opinionated, purposeful, and reduced-motion-aware." },
    ],
  }),
});

const SPRINGS = [
  { name: "snap", cfg: { stiffness: 500, damping: 32 }, body: "Buttons, tabs, toggles — anything you press." },
  { name: "soft", cfg: { stiffness: 260, damping: 28 }, body: "Cards, popovers, sheets — anything that lifts." },
  { name: "glide", cfg: { stiffness: 140, damping: 22 }, body: "Page transitions and hero reveals." },
];

function MotionPage() {
  const reduce = useReducedMotion();
  return (
    <DocsShell
      eyebrow="Design tokens"
      title="Motion"
      description="Nothing in Novix UI eases linearly. Motion is a language: spring physics for physical objects, cubic curves for typographic transitions."
      toc={[
        { id: "springs", label: "Springs" },
        { id: "usage", label: "Usage in motion/react" },
        { id: "reduced", label: "Reduced motion" },
      ]}
    >
      <DocSection id="springs" title="Springs">
        <DocLead>Three presets cover every interaction we ship. Click any preset to copy its spring config.</DocLead>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {SPRINGS.map((s) => (
            <SpringCard key={s.name} spring={s} reduce={Boolean(reduce)} />
          ))}
        </div>
      </DocSection>

      <DocSection id="usage" title="Usage in motion/react">
        <DocParagraph>
          Apply spring tokens to motion components via the <code className="font-mono text-[12.5px] rounded bg-subtle px-1 py-0.5">transition</code> prop:
        </DocParagraph>
        <CodeBlock
          className="mt-4"
          code={`import { motion } from "motion/react";

// The "snap" spring preset for interactive elements
const snapSpring = { type: "spring", stiffness: 500, damping: 32 };

export function AnimatedCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={snapSpring}
      className="bg-surface border border-border rounded-xl p-5"
    >
      <h3 className="text-foreground font-semibold">Interactive Card</h3>
    </motion.div>
  );
}`}
        />
      </DocSection>

      <DocSection id="reduced" title="Reduced motion">
        <DocParagraph>
          Every animation in Novix UI checks{" "}
          <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">prefers-reduced-motion</code>.
          When enabled, springs collapse to instant transitions; only opacity fades remain.
        </DocParagraph>
        <CodeBlock
          className="mt-4"
          code={`import { useReducedMotion } from "motion/react";

const reduce = useReducedMotion();
const transition = reduce
  ? { duration: 0 }
  : { type: "spring", stiffness: 500, damping: 32 };`}
        />
      </DocSection>
    </DocsShell>
  );
}

function SpringCard({
  spring,
  reduce,
}: {
  spring: typeof SPRINGS[number];
  reduce: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const configStr = `{ type: "spring", stiffness: ${spring.cfg.stiffness}, damping: ${spring.cfg.damping} }`;
    navigator.clipboard.writeText(configStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="nova-card-surface group relative flex flex-col items-center gap-4 rounded-xl p-6 transition-all hover:border-border hover:shadow-sm">
      <div className="w-full flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {spring.name}
        </p>
        <button
          type="button"
          onClick={copy}
          title="Copy spring config"
          className="flex h-6 items-center gap-1 rounded border border-border/60 bg-surface px-1.5 font-mono text-[10.5px] text-muted-foreground transition-colors hover:border-border hover:text-foreground active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 text-[10px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <motion.div
        animate={reduce ? {} : { y: [0, -18, 0] }}
        transition={
          reduce
            ? {}
            : {
                type: "spring",
                stiffness: spring.cfg.stiffness,
                damping: spring.cfg.damping,
                repeat: Infinity,
                repeatDelay: 1.4,
              }
        }
        className="size-14 rounded-2xl nova-orb"
      />

      <p className="text-center text-[13px] text-muted-foreground">{spring.body}</p>
      <p className="font-mono text-[11px] text-muted-foreground/60">
        k: {spring.cfg.stiffness} · c: {spring.cfg.damping}
      </p>
    </div>
  );
}
