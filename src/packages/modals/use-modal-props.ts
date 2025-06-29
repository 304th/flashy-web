import { useContext } from "react";
import { ModalValueContext } from "@/packages/modals/modal-center-provider";

export const useModalProps = () => useContext(ModalValueContext);
