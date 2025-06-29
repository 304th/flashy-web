import { ModalComponentPosition } from "@/packages/modals/modal-center-provider";

export const overlayAnimation = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
  transition: {
    duration: 0.15,
  },
};

export const modalAnimation = {
  [ModalComponentPosition.BOTTOM_SHEET]: {
    initial: {
      bottom: "-100%",
    },
    variants: {
      show: {
        bottom: 0,
      },
      hide: {
        bottom: "-80%",
      },
    },
  },
  [ModalComponentPosition.TOP_SHEET]: {
    initial: {
      top: "-100%",
    },
    variants: {
      show: {
        top: 0,
      },
      hide: {
        top: "-80%",
      },
    },
  },
  [ModalComponentPosition.CENTER]: {
    initial: {
      top: "50%",
      left: "50%",
      opacity: 0.7,
      y: "-48%",
      x: "-50%",
    },
    variants: {
      show: {
        opacity: 1,
        y: "-50%",
      },
      hide: {
        y: "-52%",
      },
    },
  },
  [ModalComponentPosition.RIGHT]: {
    initial: {
      top: "50%",
      opacity: 0.7,
      right: 0,
      x: 0,
      y: "-50%",
    },
    variants: {
      show: {
        opacity: 1,
        x: "-24px",
      },
      hide: {
        opacity: 0,
        x: 10,
      },
    },
  },
  [ModalComponentPosition.LEFT]: {
    initial: {
      top: "50%",
      opacity: 0.7,
      left: 0,
      x: 0,
      y: "-50%",
    },
    variants: {
      show: {
        opacity: 1,
        x: "24px",
      },
      hide: {
        x: 0,
      },
    },
  },
  [ModalComponentPosition.CUSTOM]: {
    initial: {},
    variants: {
      show: {},
      hide: {},
    },
  },
};
