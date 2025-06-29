import { useModalCenter } from "@/packages/modals";
import { ModalType } from "@/providers/modals-provider";

export const useModals = () => useModalCenter<ModalType>();
