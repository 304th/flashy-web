import { type PropsWithChildren } from "react";

export interface TagProps {
  className?: string;
}

export const Tag = ({ className, children }: PropsWithChildren<TagProps>) => {
  return (
    <div
      className={`${className} relative flex items-center justify-center w-fit py-[2px]
        px-2 border-1 border-brand-100 rounded-md text-xs`}
    >
      {children}
    </div>
  );
};
