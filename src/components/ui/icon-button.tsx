import React, { type PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";

interface IconButtonProps {
  className?: string;
}

export const IconButton = ({
  className,
  children,
  ...props
}: PropsWithChildren<IconButtonProps>) => (
  <Button
    variant="ghost"
    size="sm"
    className={`!w-fit p-0 aspect-square ${className} hover:text-white
      [&_svg:not([class*='size-'])]:size-7`}
    {...props}
  >
    {children}
  </Button>
);
