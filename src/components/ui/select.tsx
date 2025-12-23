"use client";

import * as React from "react";
import * as ScrollAreaPrimitives from "@radix-ui/react-scroll-area";
import * as RadixSelectPrimitives from "@radix-ui/react-select";
import { Slottable } from "@radix-ui/react-slot";
import { ChevronDown, Check, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PolymorphicComponentProps } from "@/lib/polymorphic";
import { cva, type VariantProps } from "class-variance-authority";

export const selectVariants = cva(
  // base styles
  "group/trigger cursor-pointer min-w-0 shrink-0 bg-base-200 shadow-regular-xs outline-none ring-1 ring-base-400 text-paragraph-sm flex items-center text-left transition duration-200 ease-out hover:bg-base-300 hover:ring-base-600 focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950 focus:text-text-strong-950 data-[placeholder]:focus:text-text-strong-950 disabled:pointer-events-none disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none disabled:ring-transparent data-[placeholder]:disabled:text-text-disabled-300 data-[placeholder]:text-text-sub-600",
  {
    variants: {
      size: {
        medium: "h-10 min-h-10 gap-2 rounded-md pl-3 pr-2.5",
        small: "h-9 min-h-9 gap-2 rounded-md pl-2.5 pr-2",
        xsmall: "!h-8 !min-h-8 gap-1.5 rounded-md pl-2 pr-1.5",
        xxsmall: "h-6 min-h-6 gap-1.5 rounded-md pl-2 pr-1.5",
      },
      variant: {
        default: "w-full",
        compact: "w-auto h-10 gap-1 rounded-md pl-3 pr-2.5",
        compactForInput:
          "w-auto rounded-none shadow-none ring-0 focus:bg-bg-weak-50 focus:shadow-none focus:ring-0 focus:ring-transparent pl-2.5 pr-2",
        inline:
          "h-5 min-h-5 w-auto gap-0 rounded-none bg-transparent p-0 text-text-sub-600 shadow-none ring-0 hover:bg-transparent hover:text-text-strong-950 focus:shadow-none data-[state=open]:text-text-strong-950",
      },
      hasError: {
        true: "ring-error-base focus:shadow-button-error-focus focus:ring-error-base",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
      hasError: false,
    },
  },
);

type SelectContextType = {
  size?: "medium" | "small" | "xsmall" | "xxsmall";
  variant?: "default" | "compact" | "compactForInput" | "inline";
  hasError?: boolean;
};

const SelectContext = React.createContext<SelectContextType>({
  size: "medium",
  variant: "default",
  hasError: false,
});

const useSelectContext = () => React.useContext(SelectContext);

const SelectPrimitivesRoot = ({
  size = "medium",
  variant = "default",
  hasError,
  ...rest
}: React.ComponentProps<typeof RadixSelectPrimitives.Root> &
  SelectContextType) => {
  return (
    <SelectContext.Provider value={{ size, variant, hasError }}>
      <RadixSelectPrimitives.Root {...rest} />
    </SelectContext.Provider>
  );
};
SelectPrimitivesRoot.displayName = "SelectRoot";

const SelectGroup = RadixSelectPrimitives.Group;
SelectGroup.displayName = "SelectGroup";

const SelectValue = RadixSelectPrimitives.Value;
SelectValue.displayName = "SelectValue";

const SelectSeparator = RadixSelectPrimitives.Separator;
SelectSeparator.displayName = "SelectSeparator";

const SelectGroupLabel = RadixSelectPrimitives.Label;
SelectGroupLabel.displayName = "SelectGroupLabel";

const SELECT_TRIGGER_ICON_NAME = "SelectTriggerIcon";

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof RadixSelectPrimitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixSelectPrimitives.Trigger>
>(({ className, children, ...rest }, forwardedRef) => {
  const { size, variant, hasError } = useSelectContext();

  const triggerClassName = selectVariants({
    size,
    variant,
    hasError,
  });

  return (
    <RadixSelectPrimitives.Trigger
      ref={forwardedRef}
      className={cn(triggerClassName, className)}
      {...rest}
    >
      <Slottable>{children}</Slottable>
      <RadixSelectPrimitives.Icon asChild>
        <ChevronDown
          className="ml-auto size-5 shrink-0 transition duration-200 ease-out
            group-data-[placeholder]/trigger:text-text-soft-400
            text-text-sub-600 group-hover/trigger:text-text-sub-600
            group-data-[placeholder]/trigger:group-hover:text-text-sub-600
            group-focus/trigger:text-text-strong-950
            group-data-[placeholder]/trigger:group-focus/trigger:text-text-strong-950
            group-disabled/trigger:text-text-disabled-300
            group-data-[placeholder]/trigger:group-disabled/trigger:text-text-disabled-300
            group-data-[state=open]/trigger:rotate-180"
        />
      </RadixSelectPrimitives.Icon>
    </RadixSelectPrimitives.Trigger>
  );
});

SelectTrigger.displayName = "SelectTrigger";

function TriggerIcon<T extends React.ElementType = "div">({
  as,
  className,
  ...rest
}: PolymorphicComponentProps<T>) {
  const Component = as || "div";

  const { size, variant, hasError } = useSelectContext();
  const variants = selectVariants({ size, variant, hasError });

  return (
    <Component
      className={cn(
        `h-5 w-auto min-w-0 shrink-0 object-contain text-text-sub-600 transition
        duration-200 ease-out
        group-data-[placeholder]/trigger:text-text-soft-400
        group-hover/trigger:text-text-sub-600
        group-data-[placeholder]/trigger:group-hover:text-text-sub-600
        group-disabled/trigger:text-text-disabled-300
        group-data-[placeholder]/trigger:group-disabled/trigger:text-text-disabled-300
        group-disabled/trigger:[&:not(.remixicon)]:opacity-[.48]`,
        className,
      )}
      {...rest}
    />
  );
}
TriggerIcon.displayName = SELECT_TRIGGER_ICON_NAME;

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof RadixSelectPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof RadixSelectPrimitives.Content>
>(
  (
    {
      className,
      position = "popper",
      children,
      sideOffset = 8,
      collisionPadding = 8,
      ...rest
    },
    forwardedRef,
  ) => (
    <RadixSelectPrimitives.Portal>
      <RadixSelectPrimitives.Content
        ref={forwardedRef}
        className={cn(
          // base
          `relative z-50 overflow-hidden rounded-md bg-base-200
          shadow-regular-md ring-1 ring-inset ring-base-600`,
          // widths
          `min-w-(--radix-select-trigger-width)
          max-w-[max(var(--radix-select-trigger-width),320px)]`,
          // heights
          "max-h-(--radix-select-content-available-height)",
          // animation
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          `data-[side=bottom]:slide-in-from-top-2
          data-[side=top]:slide-in-from-bottom-2`,
          className,
        )}
        sideOffset={sideOffset}
        position={position}
        collisionPadding={collisionPadding}
        {...rest}
      >
        <ScrollAreaPrimitives.Root type="auto">
          <RadixSelectPrimitives.Viewport asChild>
            <ScrollAreaPrimitives.Viewport
              style={{ overflowY: undefined }}
              className="max-h-[196px] w-full scroll-py-2 overflow-auto p-2"
            >
              {children}
            </ScrollAreaPrimitives.Viewport>
          </RadixSelectPrimitives.Viewport>
          <ScrollAreaPrimitives.Scrollbar orientation="vertical">
            <ScrollAreaPrimitives.Thumb className="w-1! rounded bg-bg-soft-200" />
          </ScrollAreaPrimitives.Scrollbar>
        </ScrollAreaPrimitives.Root>
      </RadixSelectPrimitives.Content>
    </RadixSelectPrimitives.Portal>
  ),
);

SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof RadixSelectPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof RadixSelectPrimitives.Item>
>(({ className, children, ...rest }, forwardedRef) => {
  const { size } = useSelectContext();

  return (
    <RadixSelectPrimitives.Item
      ref={forwardedRef}
      className={cn(
        // base
        `group relative cursor-pointer select-none rounded-md p-2 pr-9
        text-paragraph-sm`,
        "flex items-center gap-2 transition duration-200 ease-out",
        // disabled
        "data-disabled:pointer-events-none data-[disabled]:text-base-800",
        // hover, focus
        `data-[highlighted]:bg-base-400 data-highlighted:outline-0
        hover:border-base-600`,
        {
          "gap-1.5 pr-[34px]": size === "xsmall",
        },
        className,
      )}
      {...rest}
    >
      <RadixSelectPrimitives.ItemText asChild>
        <span
          className={cn(
            // base
            "flex flex-1 items-center gap-2",
            // disabled
            "group-disabled:text-text-disabled-300",
            {
              "gap-1.5": size === "xsmall",
            },
          )}
        >
          {typeof children === "string" ? (
            <span className="line-clamp-1">{children}</span>
          ) : (
            children
          )}
        </span>
      </RadixSelectPrimitives.ItemText>
      <RadixSelectPrimitives.ItemIndicator asChild>
        <Check
          className="absolute right-2 top-1/2 size-5 shrink-0 -translate-y-1/2
            text-text-sub-600"
        />
      </RadixSelectPrimitives.ItemIndicator>
    </RadixSelectPrimitives.Item>
  );
});

SelectItem.displayName = "SelectItem";

function SelectItemIcon<T extends React.ElementType>({
  as,
  className,
  ...rest
}: PolymorphicComponentProps<T>) {
  const { size, variant } = useSelectContext();
  const variants = selectVariants({ size, variant });

  const Component = as || "div";

  return (
    <Component
      className={cn(
        `size-5 shrink-0 bg-size-[1.25rem] text-text-sub-600
        [[data-disabled]_&:not(.remixicon)]:opacity-[.48]
        [[data-disabled]_&]:text-text-disabled-300`,
        className,
      )}
      {...rest}
    />
  );
}

export const SelectPrimitives = {
  Root: SelectPrimitivesRoot,
  Content: SelectContent,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Item: SelectItem,
  ItemIcon: SelectItemIcon,
  Separator: SelectSeparator,
  Trigger: SelectTrigger,
  TriggerIcon,
  Value: SelectValue,
};

function SelectRoot({
  children,
  className,
  id,
  placeholder,
  triggerIcon: TriggerIcon,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitives.Root> & {
  className?: string;
  id?: string;
  triggerIcon?: LucideIcon;
  placeholder?: React.ReactNode;
}) {
  return (
    <SelectPrimitives.Root {...props}>
      <SelectPrimitives.Trigger id={id} className={className}>
        {TriggerIcon && <SelectPrimitives.TriggerIcon as={TriggerIcon} />}
        <SelectPrimitives.Value placeholder={placeholder} />
      </SelectPrimitives.Trigger>
      <SelectPrimitives.Content>{children}</SelectPrimitives.Content>
    </SelectPrimitives.Root>
  );
}
SelectRoot.displayName = SelectPrimitives.Root.displayName;

export const Select = {
  Root: SelectRoot,
  TriggerIcon: SelectPrimitives.TriggerIcon,
  Item: SelectPrimitives.Item,
  ItemIcon: SelectPrimitives.ItemIcon,
};
