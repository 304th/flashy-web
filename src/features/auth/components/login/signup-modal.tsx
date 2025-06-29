import React from "react";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { SignupForm } from "@/features/auth/components/login/signup-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CloseButton } from "@/components/ui/close-button";
import { GoogleIcon } from "@/components/ui/icons/google";
import { defaultVariants } from "@/lib/framer";

export interface SignupModalProps {
  onClose(): void;
}

export const SignupModal = ({ onClose, ...props }: SignupModalProps) => {
  return (
    <Modal onClose={onClose} className="!p-0 border-0" {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={defaultVariants.container as any}
        className="relative flex flex-col gap-8 p-8
          bg-[linear-gradient(to_bottom,rgba(0,0,0,0.01),rgba(0,0,0,0.9)),url('/images/signup-bg.jpg')]
          bg-cover rounded-xl overflow-hidden"
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
            Welcome to Flashy
          </motion.p>
          <motion.p variants={defaultVariants.child}>
            Register to create your account
          </motion.p>
        </div>
        <SignupForm />
        <motion.div
          className="flex flex-col gap-3 items-center w-full"
          variants={defaultVariants.child}
        >
          <Button size="xl" className="w-full">
            Sign Up
          </Button>
          <Separator>Or continue with</Separator>
          <div className="flex w-full justify-center">
            <Button variant="secondary" className="w-[120px]" size="lg">
              <GoogleIcon />
            </Button>
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
