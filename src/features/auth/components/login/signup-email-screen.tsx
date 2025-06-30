import React from "react";
import { motion } from "framer-motion";
import { SignupForm } from "@/features/auth/components/login/signup-form";
import { SocialAuth } from "@/features/auth/components/login/social-auth";
import { defaultVariants } from "@/lib/framer";

export const SignupEmailScreen = ({
  onEmailSent,
}: {
  onEmailSent: (email: string) => void;
}) => {
  return (
    <>
      <motion.div
        className="flex flex-col w-full justify-center"
        initial="hidden"
        animate="show"
        variants={defaultVariants.container}
      >
        <motion.p
          className="text-3xl font-extrabold text-white"
          variants={defaultVariants.child}
        >
          Welcome to Flashy
        </motion.p>
        <motion.p variants={defaultVariants.child}>
          Register to create your account
        </motion.p>
      </motion.div>
      <div className="flex flex-col gap-3 w-full min-h-[300px]">
        <SignupForm onEmailSent={onEmailSent} />
        <SocialAuth />
      </div>
    </>
  );
};
