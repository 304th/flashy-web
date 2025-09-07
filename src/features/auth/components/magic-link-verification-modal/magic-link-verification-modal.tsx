import React from "react";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useVerifyEmailLink } from "@/features/auth/queries/use-verify-email-link";
import { defaultVariants } from "@/lib/framer";

export interface MagicLinkVerificationModalProps {
  onClose(): void;
}

export const MagicLinkVerificationModal = ({ onClose, ...props }: MagicLinkVerificationModalProps) => {
  useVerifyEmailLink(() => {
    const currentUrl = new URL(window.location.href);
    const newUrl = new URL(currentUrl.origin + currentUrl.pathname);
    history.replaceState(null, '', newUrl.toString());
  })

  return (
    <Modal onClose={onClose} className="!p-0 border-0" {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col gap-16 p-8
          bg-[url('/images/login-bg.jpg')] bg-cover rounded-xl
          overflow-hidden"
        variants={defaultVariants.container}
      >
        <motion.div className="absolute right-4 top-4" onClick={onClose}>
          <CloseButton />
        </motion.div>
        <motion.div
          className="flex flex-col w-full justify-between max-w-[450px] gap-4"
          variants={defaultVariants.container}
        >
          <motion.p
            className="text-3xl font-extrabold text-white"
            variants={defaultVariants.child}
          >
            Connecting You Now...
          </motion.p>
          <motion.div variants={defaultVariants.child}>
            <p>Hang tight, we're getting you signed in.</p>
          </motion.div>
          <div className="flex w-full justify-center">
            <Spinner />
          </div>
        </motion.div>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`sm:min-w-unset min-w-[450px] sm:w-full ${props.className}`}
  />
);
