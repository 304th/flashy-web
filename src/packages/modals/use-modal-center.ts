import { useContext } from "react";
import {
  ModalCenterStateOptions,
  ModalComponentPosition,
  ModalDispatchContext,
} from "@/packages/modals/modal-center-provider";

const getOptions = <T>(type: T, options?: ModalCenterStateOptions) => {
  if (options?.position === ModalComponentPosition.CUSTOM) {
    return {
      position: ModalComponentPosition.CUSTOM as ModalComponentPosition.CUSTOM,
      locked: options?.locked ?? true,
      lightbox: options?.lightbox ?? false,
      animations: options?.animations,
      subModal: options?.subModal ?? false,
      key: options?.key ?? type,
      lockDragMobile: options?.lockDragMobile ?? false,
    };
  }

  return {
    position: options?.position ?? ModalComponentPosition.CENTER,
    locked: options?.locked ?? true,
    lightbox: options?.lightbox ?? false,
    subModal: options?.subModal ?? false,
    key: options?.key ?? type,
    lockDragMobile: options?.lockDragMobile ?? false,
  };
};

export const useModalCenter = <T extends string>() => {
  const dispatch = useContext(ModalDispatchContext);

  return {
    openModal(
      type: T,
      props?: Record<string, any>,
      options?: ModalCenterStateOptions,
    ) {
      return dispatch({
        type,
        props: props || {},
        options: getOptions<T>(type, options),
      });
    },
    closeModal(all?: boolean) {
      return dispatch?.({
        type: null,
        ...(all
          ? {
              options: {
                closeAll: true,
              },
            }
          : {}),
      });
    },
  };
};
