import * as React from "react";

function Textarea({
  className,
  noHover,
  ...props
}: React.ComponentProps<"textarea"> & { noHover?: boolean }) {
  return (
    <textarea
      data-slot="textarea"
      className={`bg-base-200 placeholder:text-muted-foreground selection:bg-primary
        selection:text-primary-foreground dark:bg-input/30 border-base-400 flex
        w-full min-w-0 rounded-md border px-3 py-2 !text-base shadow-xs
        transition-colors duration-150 outline-none disabled:pointer-events-none
        disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[80px]
        resize-none
        focus-visible:border-ring focus-visible:ring-ring/50
        focus-visible:ring-[3px] focus-visible:bg-base-400
        focus-visible:text-white
        aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
        aria-invalid:border-destructive
        ${noHover ? "" : "hover:bg-base-300 hover:border-base-600"}
        ${className || ""}`}
      {...props}
    />
  );
}

export { Textarea };
