import { PropsWithChildren, ReactNode } from "react";
import Image from "next/image";

export enum ModalFooterVariant {
  BASIC = "BASIC",
  CHECKBOX = "CHECKBOX",
  INFORMATION = "INFORMATION",
  TOGGLE = "TOGGLE",
  STEPPER = "STEPPER",
  LINK = "LINK",
  STRETCH = "STRETCH",
}

export interface ModalFooterProps {
  variant?: ModalFooterVariant;
  infoLabel?: string;
}

export const ModalFooter = ({
  variant = ModalFooterVariant.BASIC,
  infoLabel,
  children,
  ...props
}: PropsWithChildren<ModalFooterProps>) => {
  return (
    <div
      {...props}
      className="flex w-full items-center justify-between border-t
        border-[--stroke-soft-200] p-4"
    >
      {renderChildren(variant, infoLabel as string, children)}
    </div>
  );
};

const renderChildren = (
  variant: ModalFooterVariant,
  infoLabel: string,
  children: ReactNode,
) => {
  switch (variant) {
    case ModalFooterVariant.INFORMATION:
      return (
        <>
          <div className="flex items-center gap-1">
            <Image
              src="/core/info.svg"
              alt="Info Icon"
              width={20}
              height={20}
            />
            <p data-type="info-label" className="text-[--text-sub-500]">
              {infoLabel}
            </p>
          </div>
          <div className="flex items-center gap-3">{children}</div>
        </>
      );
    case ModalFooterVariant.STRETCH:
      return <div className="flex w-full items-center gap-3">{children}</div>;
    default:
      return null;
  }
};
