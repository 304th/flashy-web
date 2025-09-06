import React, { ReactNode } from "react";

export const Separator = ({ children }: { children?: ReactNode }) => {
  if (!children) {
    return (
      <div className="flex w-full items-center gap-4">
        <div className="flex grow-1 h-[1px] relative bg-base-400" />
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-4">
      {typeof children === "string" ? (
        <p className="text-sm text-foreground">{children}</p>
      ) : (
        children
      )}
      <div className="flex grow-1 h-[1px] relative bg-base-400" />
    </div>
  );
};
