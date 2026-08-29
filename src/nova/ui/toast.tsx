import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cn } from "../utils";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (t: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const iconMap: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const accentMap: Record<ToastVariant, string> = {
  success: "text-emerald-400 [--nova-toast-glow:oklch(0.7_0.17_150)]",
  error: "text-rose-400 [--nova-toast-glow:oklch(0.65_0.2_20)]",
  warning: "text-amber-400 [--nova-toast-glow:oklch(0.78_0.14_80)]",
  info: "text-sky-400 [--nova-toast-glow:oklch(0.7_0.14_240)]",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<ToastContextValue["toast"]>((t) => {
    const id = crypto.randomUUID();
    const item: ToastItem = { variant: "info", duration: 4200, ...t, id };
    setToasts((prev) => [...prev, item]);
    if (item.duration && item.duration > 0) {
      setTimeout(() => dismiss(id), item.duration);
    }
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = iconMap[t.variant ?? "info"];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className={cn(
                  "pointer-events-auto relative flex gap-3 rounded-xl border border-border/60 bg-surface/95 p-3.5 pr-9 backdrop-blur-xl",
                  "shadow-[0_1px_0_0_color-mix(in_oklab,white_18%,transparent)_inset,0_20px_50px_-15px_rgba(0,0,0,0.5),0_0_0_1px_color-mix(in_oklab,var(--nova-toast-glow)_25%,transparent)]",
                  accentMap[t.variant ?? "info"],
                )}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground opacity-60 transition hover:bg-subtle hover:opacity-100"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

/** Non-hook helper — safe no-op when provider absent (SSR). */
export function useOptionalToast() {
  return useContext(ToastContext);
}
