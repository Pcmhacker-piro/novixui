import { forwardRef, useState, type HTMLAttributes } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../utils";

export interface SnippetProps extends HTMLAttributes<HTMLDivElement> {
  /** The command or text to display and copy. */
  children: string;
  /** Optional shell prompt prefix ("$", ">", etc.). */
  prompt?: string;
  /** Label announced to screen readers on the copy button. */
  copyLabel?: string;
}

/**
 * Snippet — one-line copyable command/token strip.
 */
export const Snippet = forwardRef<HTMLDivElement, SnippetProps>(function Snippet(
  { children, prompt = "$", copyLabel = "Copy to clipboard", className, ...rest },
  ref,
) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "nova-card-surface flex items-center gap-3 rounded-xl border border-border/70 bg-surface px-3 py-2 font-mono text-[13px]",
        className,
      )}
      {...rest}
    >
      {prompt && <span className="select-none text-muted-foreground">{prompt}</span>}
      <code className="flex-1 truncate text-foreground">{children}</code>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copyLabel}
        className={cn(
          "grid size-7 place-items-center rounded-md text-muted-foreground transition-colors",
          "hover:bg-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        )}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
});
