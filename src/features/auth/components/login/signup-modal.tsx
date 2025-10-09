import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { SignupEmailScreen } from "@/features/auth/components/login/signup-email-screen";
import { SignupOtpScreen } from "@/features/auth/components/login/signup-otp-screen";
import { defaultVariants } from "@/lib/framer";
import { useModals } from "@/hooks/use-modals";

export interface SignupModalProps {
  onClose(): void;
}

export const SignupModal = ({ onClose, ...props }: SignupModalProps) => {
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const { openModal } = useModals();
  const handleClose = () => {
    if (emailSent) {
      openModal(
        "ConfirmModal",
        {
          title: "Unsaved Changes",
          description:
            "Are you sure you want to leave? Your email will not be saved.",
          actionTitle: "Leave",
          destructive: true,
          onConfirm: () => {
            onClose();
          },
        },
        { subModal: true },
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal onClose={handleClose} className="!p-0 border-0" {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col gap-8 p-8
          bg-[url('/images/signup-bg.jpg')] bg-cover bg-[0%_60%] rounded-xl
          overflow-hidden"
        variants={defaultVariants.container}
      >
        <motion.div className="absolute right-4 top-4" onClick={handleClose}>
          <CloseButton />
        </motion.div>
        <AnimatePresence>
          {!emailSent && (
            <SignupEmailScreen onEmailSent={(email) => setEmailSent(email)} />
          )}
          {emailSent && (
            <SignupOtpScreen email={emailSent} onVerify={onClose} />
          )}
        </AnimatePresence>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset min-w-[450px] max-sm:w-full
      ${props.className}`}
  />
);
