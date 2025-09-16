import React from "react";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { PostCreate } from "@/features/social/components/post-create/post-create";

export interface SocialCreateModal {
  onClose(): void;
}

export const SocialCreateModal = ({
 onClose,
 ...props
}: SocialCreateModal) => {
  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
      >
        <div className="flex w-full">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <PostCreate onSuccess={() => onClose()} />
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`sm:min-w-unset min-w-[600px] overflow-hidden !bg-base-200
      !rounded-md sm:w-full ${props.className}`}
  />
);
