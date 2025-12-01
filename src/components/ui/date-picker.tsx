"use client";

import * as React from "react";
import { Time } from "@internationalized/date";
import {
  AriaTimeFieldProps,
  TimeValue,
  useDateSegment,
  useTimeField,
} from "@react-aria/datepicker";
import {
  useTimeFieldState,
  type DateFieldState,
  type DateSegment,
} from "@react-stately/datepicker";
import { RiCalendarLine, RiSubtractFill } from "@remixicon/react";
import { format, type Locale } from "date-fns";
import { enUS } from "date-fns/locale";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Calendar as CalendarPrimitive, type Matcher } from "./calendar";
import { Popover } from "./popover";

// #region TimeInput
// ============================================================================

const isBrowserLocaleClockType24h = () => {
  const language =
    typeof window !== "undefined" ? window.navigator.language : "en-US";

  const hr = new Intl.DateTimeFormat(language, {
    hour: "numeric",
  }).format();

  return Number.isInteger(Number(hr));
};

type TimeSegmentProps = {
  segment: DateSegment;
  state: DateFieldState;
};

const TimeSegment = ({ segment, state }: TimeSegmentProps) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const { segmentProps } = useDateSegment(segment, state, ref);

  const isColon = segment.type === "literal" && segment.text === ":";
  const isSpace = segment.type === "literal" && segment.text === " ";

  const isDecorator = isColon || isSpace;

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={cn(
        // base
        `relative flex h-9 w-full cursor-text appearance-none items-center
        rounded-md border border-base-400 bg-base-200 px-2 text-left
        text-sm uppercase tabular-nums text-white shadow-xs
        outline-none transition-colors`,
        // focus
        "focus:border-ring focus:ring-ring/50 focus:ring-[3px] focus:bg-base-400",
        // invalid (optional)
        `group-aria-invalid/time-input:ring-destructive/20
        invalid:border-destructive invalid:ring-2 invalid:ring-destructive/20
        group-aria-invalid/time-input:border-destructive
        group-aria-invalid/time-input:ring-2
        group-aria-invalid/time-input:ring-destructive/20`,
        {
          "w-fit! border-none bg-transparent px-0 text-muted-foreground shadow-none":
            isDecorator,
          hidden: isSpace,
          "shadow-none border-transparent text-muted-foreground opacity-50":
            state.isDisabled || !segment.isEditable,
          "bg-base-300": state.isDisabled && segment.isEditable,
        },
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          `pointer-events-none block w-full text-left text-sm
          text-muted-foreground`,
          {
            hidden: !segment.isPlaceholder,
            "h-0": !segment.isPlaceholder,
          },
        )}
      >
        {segment.placeholder}
      </span>
      {segment.isPlaceholder ? " " : segment.text}
    </div>
  );
};

type TimeInputProps = Omit<
  AriaTimeFieldProps<TimeValue>,
  "label" | "shouldForceLeadingZeros" | "description" | "errorMessage"
>;

const TimeInput = React.forwardRef<HTMLDivElement, TimeInputProps>(
  ({ hourCycle, ...props }: TimeInputProps, ref) => {
    const innerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
      ref,
      () => innerRef?.current,
    );

    const locale = window !== undefined ? window.navigator.language : "en-US";

    const state = useTimeFieldState({
      hourCycle,
      locale,
      shouldForceLeadingZeros: true,
      autoFocus: true,
      ...props,
    });

    const { fieldProps } = useTimeField(
      {
        ...props,
        hourCycle,
        shouldForceLeadingZeros: true,
      },
      state,
      innerRef,
    );

    return (
      <div
        {...fieldProps}
        ref={innerRef}
        className="group/time-input inline-flex w-full gap-x-2"
      >
        {state.segments.map((segment, i) => (
          <TimeSegment key={i} segment={segment} state={state} />
        ))}
      </div>
    );
  },
);
TimeInput.displayName = "TimeInput";

// #region Trigger
// ============================================================================

interface TriggerProps extends React.ComponentProps<typeof Button> {
  placeholder?: string;
}

const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  (
    { className, children, placeholder, ...props }: TriggerProps,
    forwardedRef,
  ) => {
    return (
      <Popover.Trigger asChild>
        <Button
          ref={forwardedRef}
          className={cn(
            "w-full justify-start text-left font-normal data-[state=open]:ring-ring/50 data-[state=open]:ring-[3px]",
            !children && "text-muted-foreground",
            className,
          )}
          variant="secondary"
          mode="stroke"
          {...props}
        >
          <RiCalendarLine className="mr-2 h-4 w-4" />
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {children || placeholder || "Select date"}
          </span>
        </Button>
      </Popover.Trigger>
    );
  },
);

Trigger.displayName = "DatePicker.Trigger";

// #region Popover
// ============================================================================

const CalendarPopover = React.forwardRef<
  React.ElementRef<typeof Popover.Content>,
  React.ComponentProps<typeof Popover.Content>
>(({ align, className, children, ...props }, forwardedRef) => {
  return (
    <Popover.Content
      ref={forwardedRef}
      sideOffset={10}
      side="bottom"
      align={align}
      avoidCollisions
      onOpenAutoFocus={(e) => e.preventDefault()}
      className={cn(
        `w-full min-w-[calc(var(--radix-select-trigger-width)-2px)] max-w-[95vw]
        p-0 bg-base-200 border border-base-400 rounded-md shadow-md`,
        className,
      )}
      {...props}
    >
      {children}
    </Popover.Content>
  );
});

CalendarPopover.displayName = "DatePicker.CalendarPopover";

// #region Date Picker Shared
// ============================================================================

const formatDate = (
  date: Date,
  locale: Locale,
  includeTime?: boolean,
): string => {
  const usesAmPm = !isBrowserLocaleClockType24h();
  let dateString: string;

  if (includeTime) {
    dateString = usesAmPm
      ? format(date, "dd MMM, yyyy h:mm a", { locale })
      : format(date, "dd MMM, yyyy HH:mm", { locale });
  } else {
    dateString = format(date, "dd MMM, yyyy", { locale });
  }

  return dateString;
};

type CalendarProps = {
  fromYear?: number;
  toYear?: number;
  fromMonth?: Date;
  toMonth?: Date;
  fromDay?: Date;
  toDay?: Date;
  fromDate?: Date;
  toDate?: Date;
  locale?: Locale;
};

type Translations = {
  cancel?: string;
  apply?: string;
  start?: string;
  end?: string;
  range?: string;
};

interface PickerProps extends CalendarProps {
  className?: string;
  disabled?: boolean;
  disabledDays?: Matcher | Matcher[] | undefined;
  required?: boolean;
  showTimePicker?: boolean;
  placeholder?: string;
  enableYearNavigation?: boolean;
  disableNavigation?: boolean;
  id?: string;
  // Customize the date picker for different languages.
  translations?: Translations;
  align?: "center" | "end" | "start";
  "aria-invalid"?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-required"?: boolean;
}

// #region Single Date Picker
// ============================================================================

interface SingleProps extends Omit<PickerProps, "translations"> {
  defaultValue?: Date;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  translations?: Omit<Translations, "range">;
}

const SingleDatePicker = ({
  defaultValue,
  value,
  onChange,
  disabled,
  disabledDays,
  disableNavigation,
  className,
  showTimePicker,
  placeholder = "Select date",
  translations,
  locale = enUS,
  align = "center",
  ...props
}: SingleProps) => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    value ?? defaultValue ?? undefined,
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);

  const [time, setTime] = React.useState<TimeValue | null>(
    value
      ? new Time(value.getHours(), value.getMinutes())
      : defaultValue
        ? new Time(defaultValue.getHours(), defaultValue.getMinutes())
        : new Time(0, 0),
  );

  const initialDate = React.useMemo(() => {
    return date;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    setDate(value ?? defaultValue ?? undefined);
  }, [value, defaultValue]);

  React.useEffect(() => {
    if (date) {
      setMonth(date);
    }
  }, [date]);

  React.useEffect(() => {
    if (!open) {
      setMonth(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onCancel = () => {
    setDate(initialDate);
    setTime(
      initialDate
        ? new Time(initialDate.getHours(), initialDate.getMinutes())
        : new Time(0, 0),
    );
    setOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onCancel();
    }

    setOpen(open);
  };

  const onDateChange = (date: Date | undefined) => {
    const newDate = date;
    if (showTimePicker) {
      if (newDate && !time) {
        setTime(new Time(0, 0));
      }
      if (newDate && time) {
        newDate.setHours(time.hour);
        newDate.setMinutes(time.minute);
      }
    }
    setDate(newDate);
  };

  const onTimeChange = (time: TimeValue | null) => {
    setTime(time);

    if (!date) {
      return;
    }

    const newDate = new Date(date.getTime());

    if (!time) {
      newDate.setHours(0);
      newDate.setMinutes(0);
    } else {
      newDate.setHours(time.hour);
      newDate.setMinutes(time.minute);
    }

    setDate(newDate);
  };

  const formattedDate = React.useMemo(() => {
    if (!date) {
      return null;
    }

    return formatDate(date, locale, showTimePicker);
  }, [date, locale, showTimePicker]);

  const onApply = () => {
    setOpen(false);
    onChange?.(date);
  };

  React.useEffect(() => {
    setDate(value ?? defaultValue ?? undefined);
    setTime(
      value
        ? new Time(value.getHours(), value.getMinutes())
        : defaultValue
          ? new Time(defaultValue.getHours(), defaultValue.getMinutes())
          : new Time(0, 0),
    );
  }, [value, defaultValue]);

  return (
    <Popover.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Trigger
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        aria-required={props.required || props["aria-required"]}
        aria-invalid={props["aria-invalid"]}
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"]}
      >
        {formattedDate}
      </Trigger>
      <CalendarPopover align={align}>
        <div className="flex">
          <div className="flex flex-col sm:flex-row sm:items-start">
            <div>
              <CalendarPrimitive
                mode="single"
                month={month}
                onMonthChange={setMonth}
                selected={date}
                onSelect={onDateChange}
                disabled={disabledDays}
                locale={locale}
                disableNavigation={disableNavigation}
                initialFocus
                {...props}
              />
              {showTimePicker && (
                <div className="border-t p-3">
                  <TimeInput
                    aria-label="Time"
                    onChange={onTimeChange}
                    isDisabled={!date}
                    value={time}
                    isRequired={props.required}
                  />
                </div>
              )}
              <div className="flex items-center gap-x-2 border-t p-3">
                <Button
                  variant="secondary"
                  mode="stroke"
                  className="h-8 w-full"
                  type="button"
                  onClick={onCancel}
                >
                  {translations?.cancel ?? "Cancel"}
                </Button>
                <Button
                  className="h-8 w-full"
                  type="button"
                  onClick={onApply}
                >
                  {translations?.apply ?? "Apply"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CalendarPopover>
    </Popover.Root>
  );
};

// #region Range Date Picker
// ============================================================================

type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

interface RangeProps extends PickerProps {
  defaultValue?: DateRange;
  value?: DateRange;
  onChange?: (dateRange: DateRange | undefined) => void;
}

const RangeDatePicker = ({
  defaultValue,
  value,
  onChange,
  disabled,
  disableNavigation,
  disabledDays,
  locale = enUS,
  showTimePicker,
  placeholder = "Select date range",
  translations,
  align = "center",
  className,
  ...props
}: RangeProps) => {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange | undefined>(
    value ?? defaultValue ?? undefined,
  );
  const [month, setMonth] = React.useState<Date | undefined>(range?.from);

  const [startTime, setStartTime] = React.useState<TimeValue | null>(
    value?.from
      ? new Time(value.from.getHours(), value.from.getMinutes())
      : defaultValue?.from
        ? new Time(defaultValue.from.getHours(), defaultValue.from.getMinutes())
        : new Time(0, 0),
  );
  const [endTime, setEndTime] = React.useState<TimeValue | null>(
    value?.to
      ? new Time(value.to.getHours(), value.to.getMinutes())
      : defaultValue?.to
        ? new Time(defaultValue.to.getHours(), defaultValue.to.getMinutes())
        : new Time(0, 0),
  );

  const initialRange = React.useMemo(() => {
    return range;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    setRange(value ?? defaultValue ?? undefined);
  }, [value, defaultValue]);

  React.useEffect(() => {
    if (range) {
      setMonth(range.from);
    }
  }, [range]);

  React.useEffect(() => {
    if (!open) {
      setMonth(range?.from);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onRangeChange = (range: DateRange | undefined) => {
    const newRange = range;
    if (showTimePicker) {
      if (newRange?.from && !startTime) {
        setStartTime(new Time(0, 0));
      }

      if (newRange?.to && !endTime) {
        setEndTime(new Time(0, 0));
      }

      if (newRange?.from && startTime) {
        newRange.from.setHours(startTime.hour);
        newRange.from.setMinutes(startTime.minute);
      }

      if (newRange?.to && endTime) {
        newRange.to.setHours(endTime.hour);
        newRange.to.setMinutes(endTime.minute);
      }
    }

    setRange(newRange);
  };

  const onCancel = () => {
    setRange(initialRange);
    setStartTime(
      initialRange?.from
        ? new Time(initialRange.from.getHours(), initialRange.from.getMinutes())
        : new Time(0, 0),
    );
    setEndTime(
      initialRange?.to
        ? new Time(initialRange.to.getHours(), initialRange.to.getMinutes())
        : new Time(0, 0),
    );
    setOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onCancel();
    }

    setOpen(open);
  };

  const onTimeChange = (time: TimeValue | null, pos: "start" | "end") => {
    switch (pos) {
      case "start":
        setStartTime(time);
        break;
      case "end":
        setEndTime(time);
        break;
    }

    if (!range) {
      return;
    }

    if (pos === "start") {
      if (!range.from) {
        return;
      }

      const newDate = new Date(range.from.getTime());

      if (!time) {
        newDate.setHours(0);
        newDate.setMinutes(0);
      } else {
        newDate.setHours(time.hour);
        newDate.setMinutes(time.minute);
      }

      setRange({
        ...range,
        from: newDate,
      });
    }

    if (pos === "end") {
      if (!range.to) {
        return;
      }

      const newDate = new Date(range.to.getTime());

      if (!time) {
        newDate.setHours(0);
        newDate.setMinutes(0);
      } else {
        newDate.setHours(time.hour);
        newDate.setMinutes(time.minute);
      }

      setRange({
        ...range,
        to: newDate,
      });
    }
  };

  React.useEffect(() => {
    setRange(value ?? defaultValue ?? undefined);

    setStartTime(
      value?.from
        ? new Time(value.from.getHours(), value.from.getMinutes())
        : defaultValue?.from
          ? new Time(
              defaultValue.from.getHours(),
              defaultValue.from.getMinutes(),
            )
          : new Time(0, 0),
    );
    setEndTime(
      value?.to
        ? new Time(value.to.getHours(), value.to.getMinutes())
        : defaultValue?.to
          ? new Time(defaultValue.to.getHours(), defaultValue.to.getMinutes())
          : new Time(0, 0),
    );
  }, [value, defaultValue]);

  const displayRange = React.useMemo(() => {
    if (!range) {
      return null;
    }

    return `${
      range.from ? formatDate(range.from, locale, showTimePicker) : ""
    } - ${range.to ? formatDate(range.to, locale, showTimePicker) : ""}`;
  }, [range, locale, showTimePicker]);

  const onApply = () => {
    setOpen(false);
    onChange?.(range);
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Trigger
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        aria-required={props.required || props["aria-required"]}
        aria-invalid={props["aria-invalid"]}
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"]}
      >
        {displayRange}
      </Trigger>
      <CalendarPopover align={align}>
        <div className="flex">
          <div
            className="flex flex-col overflow-x-auto sm:flex-row sm:items-start"
          >
            <div className="overflow-x-auto">
              <CalendarPrimitive
                mode="range"
                selected={range}
                onSelect={onRangeChange}
                month={month}
                onMonthChange={setMonth}
                disabled={disabledDays}
                disableNavigation={disableNavigation}
                locale={locale}
                initialFocus
                classNames={{
                  root: "flex items-center justify-center",
                  months:
                    "flex flex-row divide-x divide-stroke-sub-200 overflow-x-auto",
                }}
                {...props}
              />
              {showTimePicker && (
                <div
                  className="flex items-center justify-evenly gap-x-3 border-t
                    p-3"
                >
                  <div className="flex flex-1 items-center gap-x-2">
                    <span className="text-text-sub-600">
                      {translations?.start ?? "Start"}:
                    </span>
                    <TimeInput
                      value={startTime}
                      onChange={(v) => onTimeChange(v, "start")}
                      aria-label="Start date time"
                      isDisabled={!range?.from}
                      isRequired={props.required}
                    />
                  </div>
                  <RiSubtractFill
                    className="size-4 shrink-0 text-stroke-soft-200"
                  />
                  <div className="flex flex-1 items-center gap-x-2">
                    <span className="text-text-sub-600">
                      {translations?.end ?? "End"}:
                    </span>
                    <TimeInput
                      value={endTime}
                      onChange={(v) => onTimeChange(v, "end")}
                      aria-label="End date time"
                      isDisabled={!range?.to}
                      isRequired={props.required}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2 border-t p-4">
                <p className="tabular-nums">
                  <span className="inline text-text-sub-600">
                    {translations?.range ?? "Range"}:
                  </span>{" "}
                  <span className="inline font-medium">{displayRange}</span>
                </p>
                <div className="grid grid-cols-2 gap-x-2">
                  <Button
                    variant="secondary"
                    mode="stroke"
                    size="sm"
                    onClick={onCancel}
                  >
                    {translations?.cancel ?? "Cancel"}
                  </Button>
                  <Button variant="default" size="sm" onClick={onApply}>
                    {translations?.apply ?? "Apply"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CalendarPopover>
    </Popover.Root>
  );
};

// #region Types & Exports
// ============================================================================

type SingleDatePickerProps = {
  defaultValue?: Date;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
} & PickerProps;

const DatePicker = ({ ...props }: SingleDatePickerProps) => {
  return <SingleDatePicker {...(props as SingleProps)} />;
};

DatePicker.displayName = "DatePicker";

type RangeDatePickerProps = {
  defaultValue?: DateRange;
  value?: DateRange;
  onChange?: (dateRange: DateRange | undefined) => void;
} & PickerProps;

const DateRangePicker = ({ ...props }: RangeDatePickerProps) => {
  return <RangeDatePicker {...(props as RangeProps)} />;
};

DateRangePicker.displayName = "DateRangePicker";

export { DatePicker, DateRangePicker, type DateRange };
