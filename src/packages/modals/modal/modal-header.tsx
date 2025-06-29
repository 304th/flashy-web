import { PropsWithChildren, ReactNode } from "react";
import { ShieldCloseIcon } from "lucide-react";

export enum ModalHeaderVariant {
  BASIC = "BASIC",
  LEFT_ICON = "LEFT_ICON",
  ERROR = "ERROR",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
  INFORMATION = "INFORMATION",
}

export enum ModalHeaderIconSize {
  MEDIUM = "MEDIUM",
  SMALL = "SMALL",
}

export interface ModalHeaderProps {
  description?: ReactNode | string;
  variant?: ModalHeaderVariant;
  centered?: boolean;
  className?: string;
  iconSize?: ModalHeaderIconSize;
  onClose(): void;
}

export const ModalHeader = ({
  variant = ModalHeaderVariant.BASIC,
  description,
  centered,
  onClose,
  className,
  children,
  ...props
}: PropsWithChildren<ModalHeaderProps>) => {
  return (
    <div
      {...props}
      className={`border-b-1 relative flex w-full gap-4 rounded-t-[12px]
        border-stroke-soft-200 bg-bg-white-0 p-5
        ${centered ? "flex-col items-center" : ""} ${className}`}
    >
      {renderIcon(variant)}
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center justify-center text-center">
          {typeof children === "string" ? <p>{children}</p> : children}
          <div
            className="absolute right-2.5 flex cursor-pointer items-center
              justify-center"
            onClick={onClose}
          >
            {/*<CompactButton*/}
            {/*  type="button"*/}
            {/*  variant="ghost"*/}
            {/*  size="large"*/}
            {/*  icon={ShieldCloseIcon}*/}
            {/*/>*/}
          </div>
        </div>
        {description && (
          <p className="text-label-sm text-text-strong-950">{description}</p>
        )}
      </div>
    </div>
  );
};

const renderIcon = (variant: ModalHeaderVariant) => {
  switch (variant) {
    case ModalHeaderVariant.LEFT_ICON:
      return null;
    case ModalHeaderVariant.ERROR:
      return null;
    case ModalHeaderVariant.WARNING:
      return null;
    case ModalHeaderVariant.SUCCESS:
      return null;
    case ModalHeaderVariant.INFORMATION:
      return null;
    case ModalHeaderVariant.BASIC:
    default:
      return null;
  }
};
