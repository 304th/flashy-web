import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { SignupEmailScreen } from "@/features/auth/components/login/signup-email-screen";
import { MagicLinkSentScreen } from "@/features/auth/components/login/magic-link-sent-screen";
import { useMeAuthed } from "@/features/auth/hooks/use-me-authed";
import { defaultVariants } from "@/lib/framer";

export interface SignInModalProps {
  onClose(): void;
}

export const SignInModal = ({ onClose, ...props }: SignInModalProps) => {
  const [emailSent, setEmailSent] = useState<string | null>(null);
  useMeAuthed(onClose);

  return (
    <Modal onClose={onClose} className="!p-0 border-0" {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col gap-16 p-8
          bg-[url('/images/login-bg.jpg')] bg-cover rounded-xl overflow-hidden
          border"
        variants={defaultVariants.container}
      >
        <motion.div className="absolute right-4 top-4" onClick={onClose}>
          <CloseButton />
        </motion.div>
        <AnimatePresence>
          {!emailSent && (
            <SignupEmailScreen onEmailSent={(email) => setEmailSent(email)} />
          )}
          {emailSent && <MagicLinkSentScreen email={emailSent} />}
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
