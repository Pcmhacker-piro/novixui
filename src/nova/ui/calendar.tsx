import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous: "absolute left-1 top-1 inline-flex size-7 items-center justify-center rounded-md border border-border bg-transparent p-0 opacity-60 hover:opacity-100 hover:bg-subtle",
        button_next: "absolute right-1 top-1 inline-flex size-7 items-center justify-center rounded-md border border-border bg-transparent p-0 opacity-60 hover:opacity-100 hover:bg-subtle",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.75rem]",
        week: "flex w-full mt-2",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 h-9 w-9",
        day_button: "inline-flex size-9 items-center justify-center rounded-md p-0 font-normal aria-selected:opacity-100 hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected: "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary",
        today: "[&>button]:bg-subtle [&>button]:text-foreground",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />,
      }}
      {...props} />
  );
}
