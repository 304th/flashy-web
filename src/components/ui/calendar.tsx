"use client";

import * as React from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { DayPicker } from "react-day-picker";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const compactButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors outline-none cursor-pointer",
  {
    variants: {
      variant: {
        white:
          "bg-base-200 hover:bg-base-400 text-foreground hover:text-white border border-base-400",
      },
      size: {
        large: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "white",
      size: "large",
    },
  },
);

const compactButton = {
  root: ({ class: className }: { class?: string }) =>
    cn(compactButtonVariants(), className),
};

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  classNames,
  weekStartsOn = 1,
  numberOfMonths = 1,
  ...rest
}: CalendarProps) {
  return (
    <DayPicker
      weekStartsOn={weekStartsOn}
      numberOfMonths={numberOfMonths}
      showOutsideDays={numberOfMonths === 1}
      classNames={{
        multiple_months: "",
        caption_start: "p-5",
        caption_end: "p-5",
        months: "flex divide-x divide-base-400",
        month: "space-y-2",
        caption:
          "flex justify-center items-center relative rounded-md bg-base-300 h-9",
        caption_label: "text-sm text-foreground select-none",
        nav: "flex items-center",
        nav_button: compactButton.root({ class: "absolute" }),
        nav_button_previous: "top-1/2 -translate-y-1/2 left-1.5",
        nav_button_next: "top-1/2 -translate-y-1/2 right-1.5",
        table: "w-full border-collapse",
        head_row: "flex gap-2",
        head_cell:
          "text-muted-foreground text-sm uppercase size-10 flex items-center justify-center text-center select-none",
        row: "grid grid-flow-col auto-cols-auto w-full mt-2 gap-2",
        cell: cn(
          // base
          "group/cell relative size-10 shrink-0 select-none p-0",
          // range
          "[&:has(.day-range-middle)]:bg-brand-100/10",
          "first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg",
          // first range el
          "[&:not(:has(button))+:has(.day-range-middle)]:rounded-l-lg",
          // last range el
          "[&:not(:has(+*button))]:rounded-r-lg",
          // hide before if next sibling not selected
          "[&:not(:has(+*[type=button]))]:before:hidden",
          // merged bg
          "before:absolute before:inset-y-0 before:-right-2 before:hidden before:w-2 before:bg-brand-100/10",
          "last:[&:has(.day-range-middle)]:before:hidden",
          // middle
          "[&:has(.day-range-middle)]:before:block",
          // start
          "[&:has(.day-range-start)]:before:block [&:has(.day-range-start)]:before:w-3",
          // end
          "[&:has(.day-range-end):not(:first-child)]:before:block! [&:has(.day-range-end)]:before:left-0 [&:has(.day-range-end)]:before:right-auto",
        ),
        day: cn(
          // base
          "flex size-10 shrink-0 items-center justify-center rounded-md text-center text-sm text-foreground outline-none",
          "transition duration-200 ease-out",
          // hover
          "hover:bg-base-300 hover:text-white",
          // selected
          "aria-[selected]:bg-brand-200/70 aria-[selected]:text-white",
          // focus visible
          "focus:outline-none focus-visible:bg-base-300 focus-visible:text-white",
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: "day-selected",
        day_range_middle: "day-range-middle !text-brand-200 bg-transparent!",
        day_today: "day-today",
        day_outside:
          "day-outside !text-muted-foreground !opacity-50 aria-[selected]:!text-white aria-[selected]:!opacity-100",
        day_disabled: "day-disabled !text-muted-foreground !opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <RiArrowLeftSLine className="size-5" />,
        IconRight: () => <RiArrowRightSLine className="size-5" />,
      }}
      {...rest}
    />
  );
}

export { type Matcher } from "react-day-picker";
