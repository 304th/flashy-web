import React from "react";
import { motion } from "framer-motion";
import { OtpForm } from "@/features/auth/components/login/otp-form";
import { defaultVariants } from "@/lib/framer";

export const SignupOtpScreen = ({
  email,
  onVerify,
}: {
  email: string;
  onVerify: () => void;
}) => {
  return (
    <>
      <motion.div
        className="flex flex-col w-full justify-between"
        variants={defaultVariants.container}
      >
        <motion.p
          className="text-3xl font-extrabold text-white"
          variants={defaultVariants.child}
        >
          Verify OTP code
        </motion.p>
        <motion.p variants={defaultVariants.child}>
          A verification code has been sent to your email.
        </motion.p>
      </motion.div>
      <div className="flex flex-col gap-3 w-full">
        <OtpForm email={email} onSuccess={onVerify} />
      </div>
    </>
  );
};
