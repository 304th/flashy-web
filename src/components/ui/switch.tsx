import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const SwitchRoot = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, disabled, ...rest }, forwardedRef) => {
  return (
    <SwitchPrimitives.Root
      className={cn(
        `group/switch block h-8 w-10 shrink-0 p-0.5 outline-none
        focus:outline-none`,
        className,
      )}
      ref={forwardedRef}
      disabled={disabled}
      {...rest}
    >
      <div
        className={cn(
          // base
          "h-6 w-10 rounded-full bg-base-400 p-0.5 outline-none cursor-pointer",
          "transition duration-200 ease-out",
          !disabled && [
            // hover
            "group-hover/switch:bg-base-500",
            // focus
            "group-focus-visible/switch:bg-base-300",
            // pressed
            "group-active/switch:bg-bg-base-300",
            // checked
            "group-data-[state=checked]/switch:bg-[#1CCC67]",
            // checked hover
            "group-hover:data-[state=checked]/switch:bg-primary-darker",
            // checked pressed
            "group-active:data-[state=checked]/switch:bg-primary-base",
            // focus
            "group-focus/switch:outline-none",
          ],
          // disabled
          disabled && [
            "bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200 opacity-50",
          ],
        )}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            // base
            "pointer-events-none relative block size-5",
            "transition-transform duration-200 ease-out",
            // checked
            "data-[state=checked]:translate-x-3",
            !disabled && [
              // before
              `before:absolute before:inset-y-0 before:left-1/3 before:w-5
              before:-translate-x-1 before:rounded-full before:bg-white`,
              "before:[mask:--mask]",
              // after
              `after:absolute after:inset-y-0 after:right-0 after:w-3
              after:-translate-x-1/3 after:rounded-full
              after:shadow-switch-thumb`,
              // pressed
              "group-active/switch:scale-[.833]",
            ],
            // disabled,
            disabled && ["rounded-full bg-base-400 shadow-none"],
          )}
          style={{
            ["--mask" as any]:
              "radial-gradient(circle farthest-side at 50% 50%, #0000 1.95px, #000 2.05px 100%) 50% 50%/100% 100% no-repeat",
          }}
        />
      </div>
    </SwitchPrimitives.Root>
  );
});
SwitchRoot.displayName = SwitchPrimitives.Root.displayName;

export const Switch = { Root: SwitchRoot };
