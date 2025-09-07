import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  trailingIcon,
  className,
  type,
  ...props
}: React.ComponentProps<"input"> & any) {
  return (
    <div className="relative">
      <input
        type={type}
        data-slot="input"
        className={cn(
          `bg-base-200 file:text-foreground placeholder:text-muted-foreground
          selection:bg-primary selection:text-primary-foreground
          dark:bg-input/30 border-base-400 flex h-12 w-full min-w-0 rounded-md
          border px-3 py-1 text-base shadow-xs transition-[color,box-shadow]
          outline-none file:inline-flex file:h-7 file:border-0
          file:bg-transparent file:text-sm file:font-medium
          disabled:pointer-events-none disabled:cursor-not-allowed
          disabled:opacity-50 md:text-sm`,
          `focus-visible:border-ring focus-visible:ring-ring/50
          focus-visible:ring-[3px] focus-visible:bg-base-400
          focus-visible:text-white`,
          `aria-invalid:ring-destructive/20
          dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
          transition hover:bg-base-300 hover:border-base-600`,
          className,
        )}
        {...props}
      />
      {trailingIcon && (
        <div className="absolute flex right-2 top-1/2 -translate-y-1/2">
          {trailingIcon}
        </div>
      )}
    </div>
  );
}

export { Input };
