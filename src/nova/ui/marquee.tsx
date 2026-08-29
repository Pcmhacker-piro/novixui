import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Seconds per full loop. */
  speed?: number;
  /** Reverse scroll direction. */
  reverse?: boolean;
  /** Pause on hover. */
  pauseOnHover?: boolean;
  /** Fade edges into the background. */
  fade?: boolean;
  /** Gap between duplicated tracks (rem). */
  gap?: number;
}

/**
 * Marquee — a smooth, GPU-accelerated infinite scroller.
 * Duplicates children once so the loop is seamless.
 */
export const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(function Marquee(
  { children, speed = 30, reverse = false, pauseOnHover = true, fade = true, gap = 2, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "group relative flex w-full overflow-hidden",
        fade && "[mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
      style={style}
      {...rest}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn(
            "flex shrink-0 items-center [animation:nova-marquee_linear_infinite]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
          style={{
            gap: `${gap}rem`,
            paddingRight: `${gap}rem`,
            animationDuration: `${speed}s`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {children}
        </div>
      ))}
      <style>{`@keyframes nova-marquee { from { transform: translateX(0) } to { transform: translateX(-100%) } }`}</style>
    </div>
  );
});
