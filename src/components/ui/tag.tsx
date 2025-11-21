import { type PropsWithChildren } from "react";

export interface TagProps {
  className?: string;
}

export const Tag = ({ className, children }: PropsWithChildren<TagProps>) => {
  return (
    <div
      className={`${className} flex items-center justify-center w-fit h-5 py-1
        px-3 border-1 border-brand-100 rounded-md text-xs font-medium`}
    >
      {children}
    </div>
  );
};
