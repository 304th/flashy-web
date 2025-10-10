import React from "react";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";

export interface ConfirmModalProps {
  title?: string;
  description?: string;
  actionTitle?: string;
  destructive?: boolean;
  onConfirm(): void;
  onCancel?(): void;
  onClose(): void;
}

export const ConfirmModal = ({
  title = "Confirm",
  description,
  actionTitle = "Proceed",
  destructive = false,
  onConfirm,
  onCancel,
  onClose,
  ...props
}: ConfirmModalProps) => {
  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col p-4 gap-6 rounded-md"
      >
        <div className="flex w-full">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">{title}</p>
            {description && (
              <p dangerouslySetInnerHTML={{ __html: description }} />
            )}
          </div>
        </div>
        <div className="flex w-full justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              onCancel?.();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {actionTitle}
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset min-w-[500px] !bg-base-300 !rounded-md
      max-sm:w-full shadow-2xl overflow-hidden ${props.className}`}
  />
);
