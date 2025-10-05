import { useModalCenter } from "@/packages/modals";
import { ModalPropsTypes } from "@/providers/modals-provider";

export const useModals = () => useModalCenter<ModalPropsTypes>();
