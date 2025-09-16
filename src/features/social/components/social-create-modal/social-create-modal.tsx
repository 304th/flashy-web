import React from "react";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";
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
        className="relative flex flex-col p-6 gap-6 rounded-md"
      >
        <div className="flex w-full">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <PostCreate />
          </div>
        </div>
        <div className="flex w-full justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`sm:min-w-unset min-w-[500px] !bg-base-300 border-none
      !rounded-md sm:w-full overflow-hidden ${props.className}`}
  />
);
