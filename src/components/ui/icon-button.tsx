import React, { type PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";

interface IconButtonProps {
  variant?: "default" | "destructive" | "secondary" | "ghost" | "link";
  size?: "xs" | "sm" | "lg" | "xl";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: React.ComponentProps<"button">["onClick"];
}

export const IconButton = ({
  className,
  variant = "ghost",
  size = "sm",
  disabled,
  children,
  ...props
}: PropsWithChildren<IconButtonProps>) => (
  <Button
    variant={variant}
    size={size}
    className={`!w-fit p-0 aspect-square ${className} hover:text-white
      ${size === "xs" ? "[&_svg:not([class*='size-'])]:size-5" : "[&_svg:not([class*='size-'])]:size-7"}
      !px-0`}
    disabled={disabled}
    {...props}
  >
    {children}
  </Button>
);
