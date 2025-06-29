import React, { ReactNode } from "react";

export const Separator = ({ children }: { children: ReactNode }) => (
  <div className="flex w-full items-center gap-1">
    <div className="flex grow-1 h-[1px] relative bg-base-500" />
    <p className="text-sm text-foreground">{children}</p>
    <div className="flex grow-1 h-[1px] relative bg-base-500" />
  </div>
);
