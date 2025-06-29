"use client";

import React, { useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
// import { enableBodyScroll, disableBodyScroll } from "body-scroll-lock";
import {
  ModalValueContext,
  ModalDispatchContext,
  ModalRegistryContext,
  ModalStackItem,
} from "./modal-center-provider";
import { overlayAnimation } from "@/packages/modals/modal-center.framer";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAnimationProps } from "@/packages/modals/utils/getVariants";
import { notEmpty } from "@/lib/utils";

interface ModalCenterProps {
  ignoreIds?: string[];
  onChange?(stack: ModalStackItem[]): void;
}

export const ModalCenter = ({ ignoreIds = [] }: ModalCenterProps) => {
  const pathname = usePathname();
  const ref = useRef<any>(null);
  const registry = useContext(ModalRegistryContext);
  const { stack } = useContext(ModalValueContext);
  const dispatch = useContext(ModalDispatchContext);
  const isMobile = useIsMobile();
  const controls = useAnimation();

  const modalComponents = stack.map((item) => ({
    Component: registry[item.type as string],
    ...item,
  }));

  // useLayoutEffect(() => {
  //   const node = ref.current;
  //
  //   if (stack.length > 0 && options.locked) {
  //     disableBodyScroll(ref.current, {
  //       reserveScrollBarGap: true,
  //       // allowTouchMove: () => ref.current,
  //     });
  //     onChange?.(stack);
  //   } else if (stack.length <= 0) {
  //     onChange?.(stack);
  //
  //     setTimeout(() => {
  //       try {
  //         if (node) {
  //           enableBodyScroll(node);
  //         }
  //       } catch {}
  //     }, 150);
  //   }
  //
  //   return () => {
  //     if (stack.length <= 0) {
  //       try {
  //         if (node) {
  //           enableBodyScroll(node);
  //         }
  //       } catch {}
  //     }
  //   };
  // }, [stack, options.locked, onChange]);

  useEffect(() => {
    dispatch({ type: null });
  }, [dispatch, pathname]);

  return (
    <AnimatePresence initial={false}>
      {notEmpty(modalComponents) && (
        <motion.div
          ref={ref}
          initial={overlayAnimation.initial}
          animate={overlayAnimation.animate}
          exit={overlayAnimation.exit}
          transition={overlayAnimation.transition}
          className="fixed bottom-0 left-0 right-0 top-0 z-[88]
            backdrop-saturate-50 bg-[#17171760] sm:w-full"
        >
          {modalComponents.map((modal, index, allModals) => (
            <motion.div
              key={`${modal.type}-${index}`}
              className={"absolute sm:w-full"}
              {...getAnimationProps(modal.options, controls, isMobile, () =>
                dispatch({ type: null }),
              )}
            >
              <modal.Component
                {...modal.props}
                key={modal.options.key}
                // root={index === 0}
                leaf={index === allModals.length - 1}
                ignoreIds={[...ignoreIds, ...(modal.props?.ignoreIds || [])]}
                onClose={() => dispatch({ type: null })}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
