import React, { type PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";

interface IconButtonProps {
  variant?: "default" | "destructive" | "secondary" | "ghost" | "link";
  size?: "sm" | "lg" | "xl";
  className?: string;
}

export const IconButton = ({
  className,
  variant = "ghost",
  size = "sm",
  children,
  ...props
}: PropsWithChildren<IconButtonProps>) => (
  <Button
    variant={variant}
    size={size}
    className={`!w-fit p-0 aspect-square ${className} hover:text-white
      [&_svg:not([class*='size-'])]:size-7 !px-0`}
    {...props}
  >
    {children}
  </Button>
);
