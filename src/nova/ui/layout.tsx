import { forwardRef, type HTMLAttributes, type ElementType, type CSSProperties } from "react";
import { cn } from "../utils";

type Size = "sm" | "md" | "lg" | "xl" | "full";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
  as?: ElementType;
}
export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { className, size = "lg", as, ...rest }, ref,
) {
  const Comp = (as ?? "div") as ElementType;
  const sizes: Record<Size, string> = {
    sm: "max-w-3xl", md: "max-w-5xl", lg: "max-w-6xl", xl: "max-w-7xl", full: "max-w-none",
  };
  return <Comp ref={ref} className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)} {...rest} />;
});

type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
const gapMap: Record<Gap, string> = {
  0: "gap-0", 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4",
  5: "gap-5", 6: "gap-6", 8: "gap-8", 10: "gap-10", 12: "gap-12",
};

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
  align?: "start" | "center" | "end" | "stretch";
  as?: ElementType;
}
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { className, gap = 4, align = "stretch", as, ...rest }, ref,
) {
  const Comp = (as ?? "div") as ElementType;
  const alignMap = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" };
  return <Comp ref={ref} className={cn("flex flex-col", gapMap[gap], alignMap[align], className)} {...rest} />;
});

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  as?: ElementType;
}
export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(
  { className, gap = 3, direction = "row", align = "center", justify = "start", wrap, as, ...rest }, ref,
) {
  const Comp = (as ?? "div") as ElementType;
  const dir = { row: "flex-row", col: "flex-col", "row-reverse": "flex-row-reverse", "col-reverse": "flex-col-reverse" };
  const al = { start: "items-start", center: "items-center", end: "items-end", baseline: "items-baseline", stretch: "items-stretch" };
  const ju = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between", around: "justify-around", evenly: "justify-evenly" };
  return <Comp ref={ref} className={cn("flex", dir[direction], al[align], ju[justify], wrap && "flex-wrap", gapMap[gap], className)} {...rest} />;
});

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: Gap;
  as?: ElementType;
}
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { className, cols = 3, gap = 4, as, style, ...rest }, ref,
) {
  const Comp = (as ?? "div") as ElementType;
  const s: CSSProperties = { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, ...style };
  return <Comp ref={ref} className={cn("grid", gapMap[gap], className)} style={s} {...rest} />;
});

export interface SpacerProps extends HTMLAttributes<HTMLDivElement> {
  size?: Gap;
  axis?: "x" | "y";
}
export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(function Spacer(
  { size = 4, axis = "y", className, style, ...rest }, ref,
) {
  const px = size * 4;
  const s: CSSProperties = axis === "y" ? { height: px, width: "100%" } : { width: px, height: "100%" };
  return <div ref={ref} aria-hidden className={cn("shrink-0", className)} style={{ ...s, ...style }} {...rest} />;
});

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = 16 / 9, className, style, children, ...rest }, ref,
) {
  return (
    <div ref={ref} className={cn("relative w-full overflow-hidden", className)} style={{ aspectRatio: String(ratio), ...style }} {...rest}>
      {children}
    </div>
  );
});

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = "horizontal", label, className, ...rest }, ref,
) {
  if (label && orientation === "horizontal") {
    return (
      <div ref={ref} role="separator" aria-orientation="horizontal" className={cn("flex items-center gap-3 text-xs text-muted-foreground", className)} {...rest}>
        <span className="h-px flex-1 bg-border" />
        <span className="uppercase tracking-wider">{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }
  return (
    <div ref={ref} role="separator" aria-orientation={orientation}
      className={cn(orientation === "horizontal" ? "h-px w-full bg-border" : "w-px self-stretch bg-border", className)} {...rest} />
  );
});
