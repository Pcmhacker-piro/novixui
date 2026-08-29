/**
 * Nova UI · Effects
 *
 * Premium visual primitives inspired by the effects genre popularized by
 * libraries like Aceternity — reimplemented from scratch with Nova's motion
 * physics, token system, and reduced-motion safety.
 *
 * All components are original: no third-party CSS or JS copied. They use
 * Nova design tokens, Motion for React, and pointer-tracked CSS variables.
 */
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { cn } from "../utils";

/* -------------------------------------------------------------------------- */
/*  Spotlight — cursor-follow radial highlight                                */
/* -------------------------------------------------------------------------- */

export const Spotlight = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { size?: number; color?: string }
>(function Spotlight({ className, children, size = 480, color, style, ...rest }, ref) {
  const inner = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = inner.current;
    if (!el || reduce) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${e.clientX - r.left}px`);
      el.style.setProperty("--sy", `${e.clientY - r.top}px`);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [reduce]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden rounded-2xl", className)}
      style={style}
      {...rest}
    >
      <div
        ref={inner}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300"
        style={
          {
            background: `radial-gradient(${size}px circle at var(--sx, 50%) var(--sy, 50%), ${color ?? "color-mix(in oklab, var(--primary) 55%, transparent)"}, transparent 60%)`,
          } as CSSProperties
        }
      />
      <div className="relative">{children}</div>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*  Aurora — softly drifting gradient blobs                                   */
/* -------------------------------------------------------------------------- */

export function Aurora({
  className,
  children,
  intensity = 1,
}: {
  className?: string;
  children?: ReactNode;
  intensity?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute block rounded-full blur-3xl"
            style={{
              width: 420 + i * 80,
              height: 420 + i * 80,
              left: `${20 + i * 25}%`,
              top: `${10 + i * 15}%`,
              background:
                i === 0
                  ? "color-mix(in oklab, var(--primary) 55%, transparent)"
                  : i === 1
                    ? "color-mix(in oklab, var(--accent, var(--primary)) 45%, transparent)"
                    : "color-mix(in oklab, oklch(0.7 0.18 280) 40%, transparent)",
              opacity: 0.55 * intensity,
              mixBlendMode: "screen",
            }}
            animate={
              reduce
                ? undefined
                : {
                    x: [0, 40, -20, 0],
                    y: [0, -30, 20, 0],
                    scale: [1, 1.08, 0.96, 1],
                  }
            }
            transition={{
              duration: 14 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Meteors — diagonal streaks                                                */
/* -------------------------------------------------------------------------- */

export function Meteors({
  count = 18,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const items = useMemo(
    () =>
      mounted
        ? Array.from({ length: count }, (_, i) => ({
            left: Math.random() * 100,
            delay: Math.random() * 6,
            duration: 4 + Math.random() * 6,
            length: 40 + Math.random() * 120,
            id: i,
          }))
        : [],
    [count, mounted],
  );
  if (reduce) return null;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {items.map((m) => (
        <span
          key={m.id}
          className="absolute top-[-10%] block h-[1px] rotate-[215deg] bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{
            left: `${m.left}%`,
            width: m.length,
            animation: `nova-meteor ${m.duration}s linear ${m.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes nova-meteor {
          0% { transform: translate3d(0,0,0) rotate(215deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate3d(-600px, 600px, 0) rotate(215deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  BackgroundBeams — animated grid + sweeping beam                           */
/* -------------------------------------------------------------------------- */

export function BackgroundBeams({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />
      {!reduce && (
        <motion.div
          className="absolute -inset-1"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent 0deg, color-mix(in oklab, var(--primary) 40%, transparent) 60deg, transparent 120deg, transparent 360deg)",
            mixBlendMode: "screen",
            filter: "blur(40px)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  MovingBorder — button with rotating gradient border                       */
/* -------------------------------------------------------------------------- */

export function MovingBorder({
  children,
  className,
  duration = 3,
  as: Tag = "button",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  as?: "button" | "a" | "div";
} & HTMLAttributes<HTMLElement>) {
  const reduce = useReducedMotion();
  return (
    <Tag
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1.5px] text-sm font-medium",
        className,
      )}
      {...(rest as HTMLAttributes<HTMLElement>)}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--primary) 90%, transparent) 90deg, transparent 180deg, color-mix(in oklab, var(--primary) 60%, transparent) 270deg, transparent 360deg)",
          animation: reduce ? undefined : `nova-mb-spin ${duration}s linear infinite`,
        }}
      />
      <span className="relative z-10 inline-flex h-11 items-center justify-center rounded-full bg-background px-6 text-foreground">
        {children}
      </span>
      <style>{`@keyframes nova-mb-spin { to { transform: rotate(360deg); } }`}</style>
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  CardTilt3D — pointer-tracked perspective card                             */
/* -------------------------------------------------------------------------- */

export function CardTilt3D({
  className,
  children,
  intensity = 12,
}: {
  className?: string;
  children: ReactNode;
  intensity?: number;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 220,
    damping: 22,
  });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 220,
    damping: 22,
  });
  return (
    <motion.div
      style={{ perspective: 1200 }}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={cn("relative", className)}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="nova-card-surface nova-card-moon-edge relative rounded-2xl p-6"
      >
        <div style={{ transform: "translateZ(40px)" }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  TextGenerate — staggered word fade-in                                     */
/* -------------------------------------------------------------------------- */

export function TextGenerate({
  text,
  className,
  stagger = 0.06,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <p className={cn("text-balance", className)}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={reduce ? false : { opacity: 0, filter: "blur(8px)", y: 6 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ delay: i * stagger, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*  GlareCard — conic sweep glare on hover                                    */
/* -------------------------------------------------------------------------- */

export function GlareCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (reduce) return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/70 bg-subtle/40 p-6",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--gx,50%) var(--gy,50%), color-mix(in oklab, white 20%, transparent), transparent 55%)",
          mixBlendMode: "overlay",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  BentoGrid — premium tiled layout                                          */
/* -------------------------------------------------------------------------- */

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(160px,auto)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BentoTile({
  className,
  children,
  span = 1,
  tall = false,
  interactive = false,
  as,
  onActivate,
  ariaLabel,
  ...rest
}: {
  className?: string;
  children: ReactNode;
  span?: 1 | 2 | 3;
  tall?: boolean;
  /** Enables keyboard focus, hover-equivalent depth lift on focus, and Enter/Space activation. */
  interactive?: boolean;
  /** Override element (defaults to <div>, or <button> when interactive). */
  as?: "div" | "button" | "a";
  onActivate?: () => void;
  ariaLabel?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const Tag = (as ?? (interactive ? "button" : "div")) as "div";
  const interactiveProps = interactive
    ? {
        tabIndex: 0,
        role: as === "a" ? undefined : Tag === ("button" as unknown) ? undefined : "button",
        "aria-label": ariaLabel,
        onClick: onActivate,
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          if (!onActivate) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onActivate();
          }
        },
      }
    : {};

  return (
    <Tag
      {...(rest as Record<string, unknown>)}
      {...interactiveProps}
      className={cn(
        "nova-card-surface nova-card-moon-edge group relative overflow-hidden rounded-2xl p-5",
        "[transform:translateZ(20px)] shadow-[0_20px_40px_-24px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out",
        // Depth lift on hover AND keyboard focus for parity
        "hover:[transform:translateZ(36px)] focus-visible:[transform:translateZ(36px)]",
        // Accessible focus ring (design-token, high-contrast, honors forced-colors)
        interactive &&
          "nova-focus-ring cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Respect reduced motion — kill the transition, keep the visual state
        "motion-reduce:transition-none motion-reduce:hover:[transform:none] motion-reduce:focus-visible:[transform:none]",
        span === 2 && "md:col-span-2",
        span === 3 && "md:col-span-3",
        tall && "md:row-span-2",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  WavyBackground — SVG wave layers                                          */
/* -------------------------------------------------------------------------- */

export function WavyBackground({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <svg
        className="absolute inset-x-0 bottom-0 h-full w-[200%]"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
      >
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d="M0,160 C200,120 400,200 600,160 C800,120 1000,200 1200,160 L1200,300 L0,300 Z"
            fill={
              i === 0
                ? "color-mix(in oklab, var(--primary) 30%, transparent)"
                : i === 1
                  ? "color-mix(in oklab, var(--primary) 18%, transparent)"
                  : "color-mix(in oklab, oklch(0.7 0.18 280) 22%, transparent)"
            }
            style={{
              animation: reduce ? undefined : `nova-wave-${i} ${12 + i * 4}s ease-in-out infinite`,
              transformOrigin: "center",
            }}
          />
        ))}
        <style>{`
          @keyframes nova-wave-0 { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-3%); } }
          @keyframes nova-wave-1 { 0%,100% { transform: translateX(-2%); } 50% { transform: translateX(2%); } }
          @keyframes nova-wave-2 { 0%,100% { transform: translateX(1%); } 50% { transform: translateX(-1%); } }
        `}</style>
      </svg>
    </div>
  );
}
