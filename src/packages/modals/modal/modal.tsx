"use client";

import {
  useRef,
  PropsWithChildren,
  ReactNode,
  useLayoutEffect,
  useEffect,
} from "react";
import { useOutsideAction } from "@/hooks/use-outside-action";

export interface ModalProps {
  leaf?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  ignoreIds?: string[];
  className?: string;
  onClose?(): void;
}

export const Modal = ({
  leaf,
  header,
  footer,
  ignoreIds,
  onClose,
  children,
  className,
  ...props
}: PropsWithChildren<ModalProps>) => {
  const ref = useRef<any>(null);
  const ignoreList = useRef<Element[]>([]);

  useOutsideAction(ref, () => {
    if (leaf) {
      onClose?.();
    }
  }, ["data-radix-popper-content-wrapper"]);

  useLayoutEffect(() => {
    if (ignoreIds) {
      let ignoredElements: Element[] = [];

      for (const id of ignoreIds) {
        const element = document.getElementById(id);

        if (element) {
          ignoredElements.push(element);
        }
      }

      ignoreList.current = ignoredElements;
    }
  }, [ignoreIds]);

  return (
    <div
      {...props}
      ref={ref}
      className={`relative flex min-w-[400px] max-sm:min-w-full max-sm:w-full flex-col
        rounded-xl bg-background border border-base-400 p-4 ${className}`}
    >
      {header}
      <div className="flex-1">{children}</div>
      {footer}
      {/* Mobile-specific styling */}
      <div
        className="z-2 absolute bottom-0 -mb-[300px] h-[300px] w-full
          bg-bg-white-0 hidden max-sm:flex"
      ></div>
    </div>
  );
};
