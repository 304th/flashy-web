import React from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CloseButtonProps {
  onClick?: () => void;
  className?: string;
}

export const CloseButton = ({ className, ...props }: CloseButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    className={`!w-fit p-0 aspect-square ${className}`}
    {...props}
  >
    <XIcon />
  </Button>
);
