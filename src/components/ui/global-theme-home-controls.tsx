import { useTheme } from "@/nova/themes/theme-provider";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export function GlobalThemeHomeControls() {
  const { resolvedTheme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <aside
      aria-label="Quick Page Controls"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 p-1.5 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-border hover:shadow-[0_16px_40px_-6px_rgba(0,0,0,0.45)] dark:bg-[#0c0c0e]/90 dark:border-white/15 dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)]"
    >
      {/* Light / Night Mode Theme Toggle */}
      <button
        type="button"
        onClick={toggle}
        aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "night"} mode`}
        title={`Switch to ${resolvedTheme === "dark" ? "Light" : "Night"} mode`}
        className="group relative grid size-9 place-items-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10 active:scale-95"
      >
        <motion.div
          key={resolvedTheme}
          initial={{ rotate: -40, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="grid place-items-center"
        >
          {resolvedTheme === "dark" ? (
            <Sun size={17} className="text-amber-400 transition-transform duration-200 group-hover:rotate-45" />
          ) : (
            <Moon size={17} className="text-indigo-600 transition-transform duration-200 group-hover:-rotate-12" />
          )}
        </motion.div>
        <span className="sr-only">
          {resolvedTheme === "dark" ? "Switch to light mode" : "Switch to night mode"}
        </span>
      </button>
    </aside>
  );
}
