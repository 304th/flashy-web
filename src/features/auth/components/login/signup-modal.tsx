import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { SignupEmailScreen } from "@/features/auth/components/login/signup-email-screen";
import { SignupOtpScreen } from "@/features/auth/components/login/signup-otp-screen";
import { defaultVariants } from "@/lib/framer";

export interface SignupModalProps {
  onClose(): void;
}

export const SignupModal = ({ onClose, ...props }: SignupModalProps) => {
  const [emailSent, setEmailSent] = useState<string | null>(null);

  return (
    <Modal onClose={onClose} className="!p-0 border-0" {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col gap-8 p-8
          bg-[url('/images/signup-bg.jpg')] bg-cover bg-bottom rounded-xl
          overflow-hidden"
        variants={defaultVariants.container}
      >
        <motion.div className="absolute right-4 top-4" onClick={onClose}>
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
    className={`sm:min-w-unset min-w-[450px] sm:w-full ${props.className}`}
  />
);
