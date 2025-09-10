import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const FileUploadRoot = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & {
    asChild?: boolean;
  }
>(({ className, asChild, ...rest }, forwardedRef) => {
  const Component = asChild ? Slot : "label";

  return (
    <Component
      ref={forwardedRef}
      className={cn(
        `flex w-full cursor-pointer flex-col items-center gap-5 rounded-md
        border border-dashed border-stroke-sub-300 bg-base-200 p-8 text-center`,
        "transition duration-200 ease-out",
        "hover:bg-base-300 hover:border-base-600",
        className,
      )}
      {...rest}
    />
  );
});
FileUploadRoot.displayName = "FileUploadRoot";

const FileUploadButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
  }
>(({ className, asChild, ...rest }, forwardedRef) => {
  const Component = asChild ? Slot : "div";

  return (
    <Component
      ref={forwardedRef}
      className={cn(
        `inline-flex h-8 items-center justify-center gap-2.5 whitespace-nowrap
        rounded-lg bg-bg-white-0 px-2.5 text-label-sm text-text-sub-600`,
        "pointer-events-none ring-1 ring-inset ring-stroke-soft-200",
        className,
      )}
      {...rest}
    />
  );
});
FileUploadButton.displayName = "FileUploadButton";

function FileUploadIcon<T extends React.ElementType>({
  className,
  as,
  ...rest
}: any) {
  const Component = as || "div";

  return (
    <Component
      className={cn("size-6 text-text-sub-600", className)}
      {...rest}
    />
  );
}

export const FileUpload = {
  Root: FileUploadRoot,
  Button: FileUploadButton,
  Icon: FileUploadIcon,
};
