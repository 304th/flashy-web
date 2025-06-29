import {
  ModalCenterStateOptions,
  ModalComponentPosition,
} from "@/packages/modals";
import { modalAnimation } from "@/packages/modals/modal-center.framer";

export const getAnimationProps = (
  options: ModalCenterStateOptions,
  controls: any,
  isMobile: boolean,
  onClose: any,
) => {
  let animationOptions;

  if (options.position === ModalComponentPosition.CUSTOM) {
    animationOptions = options.animations;
  } else {
    animationOptions = isMobile
      ? options.position === ModalComponentPosition.TOP_SHEET
        ? modalAnimation[ModalComponentPosition.TOP_SHEET]
        : modalAnimation[ModalComponentPosition.BOTTOM_SHEET]
      : modalAnimation[options.position || ModalComponentPosition.CENTER];
  }

  return {
    animate: "show",
    exit: "hide",
    initial: (animationOptions as any).initial,
    variants: (animationOptions as any).variants,
    ...(isMobile
      ? getMobileProps(
          controls,
          onClose,
          options.position === ModalComponentPosition.TOP_SHEET,
          options,
        )
      : {}),
  };
};

const getMobileProps = (
  controls: any,
  onClose: any,
  isTopSheet: boolean,
  options: ModalCenterStateOptions,
) => {
  const onDragEnd = (event: any, info: any) => {
    const shouldClose = isTopSheet
      ? info.velocity.y < -300 || (info.velocity.y <= 0 && info.offset.y < -90)
      : info.velocity.y > 300 || (info.velocity.y >= 0 && info.offset.y > 200);

    if (shouldClose) {
      controls.start("hide");
      onClose();
    }
  };

  if (options.lockDragMobile) {
    return {};
  }

  return {
    dragDirectionLock: true, // Important for y-scrolling
    onDragEnd,
    drag: "y" as const,
    dragTransition: {
      bounceStiffness: 600,
      bounceDamping: 30,
    },
    dragSnapToOrigin: true,
    dragConstraints: {
      left: 0,
      right: 0,
      ...(isTopSheet ? { bottom: 0 } : { top: 0 }),
    },
  };
};
