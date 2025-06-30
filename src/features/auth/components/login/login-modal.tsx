import React from "react";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { LoginForm } from "@/features/auth/components/login/login-form";
import { CloseButton } from "@/components/ui/close-button";
import { defaultVariants } from "@/lib/framer";
import { SocialAuth } from "@/features/auth/components/login/social-auth";

export interface LoginModalProps {
  onClose(): void;
}

export const LoginModal = ({ onClose, ...props }: LoginModalProps) => {
  return (
    <Modal onClose={onClose} className="!p-0 border-0" {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={defaultVariants.container as any}
        className="relative flex flex-col gap-8 p-8
          bg-[url(/images/login-bg.jpg)] bg-cover rounded-xl overflow-hidden"
      >
        <motion.div
          className="absolute right-4 top-4"
          variants={defaultVariants.child}
          onClick={onClose}
        >
          <CloseButton />
        </motion.div>
        <div className="flex flex-col w-full justify-center">
          <motion.p
            className="text-3xl font-extrabold text-white"
            variants={defaultVariants.child}
          >
            Welcome back
          </motion.p>
          <motion.p variants={defaultVariants.child}>
            Login to your Flashy account
          </motion.p>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <LoginForm onSuccess={onClose} />
          <SocialAuth />
        </div>
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
