import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../utils";
import { Button } from "./button";

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  page: number;
  total: number;
  siblingCount?: number;
  onChange?: (page: number) => void;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, total, siblingCount = 1, onChange, className, ...rest }, ref,
) {
  const items = useMemo<(number | "…")[]>(() => {
    const totalPageNumbers = siblingCount * 2 + 5;
    if (total <= totalPageNumbers) return range(1, total);
    const left = Math.max(page - siblingCount, 1);
    const right = Math.min(page + siblingCount, total);
    const showLeftDots = left > 2;
    const showRightDots = right < total - 1;
    if (!showLeftDots && showRightDots) return [...range(1, 3 + siblingCount * 2), "…", total];
    if (showLeftDots && !showRightDots) return [1, "…", ...range(total - 2 - siblingCount * 2, total)];
    return [1, "…", ...range(left, right), "…", total];
  }, [page, total, siblingCount]);

  const go = (p: number) => onChange?.(Math.min(Math.max(1, p), total));

  return (
    <nav ref={ref} aria-label="Pagination" className={cn("flex items-center gap-1", className)} {...rest}>
      <Button variant="ghost" size="icon" aria-label="Previous page" disabled={page <= 1} onClick={() => go(page - 1)}>
        <ChevronLeft />
      </Button>
      {items.map((it, i) =>
        it === "…" ? (
          <span key={`e${i}`} aria-hidden className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground">
            <MoreHorizontal className="size-4" />
          </span>
        ) : (
          <Button key={it} variant={it === page ? "primary" : "ghost"} size="icon"
            aria-current={it === page ? "page" : undefined} aria-label={`Page ${it}`} onClick={() => go(it)}>
            {it}
          </Button>
        ),
      )}
      <Button variant="ghost" size="icon" aria-label="Next page" disabled={page >= total} onClick={() => go(page + 1)}>
        <ChevronRight />
      </Button>
    </nav>
  );
});
