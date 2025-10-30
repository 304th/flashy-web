import { PropsWithChildren } from "react";

export interface NotFoundProps {
  fullWidth?: boolean;
  className?: string;
}

export const NotFound = ({
  fullWidth,
  children,
  className,
}: PropsWithChildren<NotFoundProps>) => (
  <div
    className={`flex flex-col items-center gap-1
      ${fullWidth ? "w-full h-full justify-center" : ""} ${className}`}
  >
    <img src="/images/not-found.svg" alt="Not found" width={48} height={48} />
    <p className="text-base-700">{children}</p>
  </div>
);
