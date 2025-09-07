import React from "react";
import { motion } from "framer-motion";
// import { OtpForm } from "@/features/auth/components/login/otp-form";
import { defaultVariants } from "@/lib/framer";
import {Spinner} from "@/components/ui/spinner/spinner";

export const MagicLinkSentScreen = ({
  email,
}: {
  email: string;
}) => {
  return (
    <>
      <motion.div
        className="flex flex-col w-full justify-between max-w-[450px] gap-4"
        variants={defaultVariants.container}
      >
        <motion.p
          className="text-3xl font-extrabold text-white"
          variants={defaultVariants.child}
        >
          Check Your Mailbox
        </motion.p>
        <motion.div variants={defaultVariants.child}>
          <p>We've sent you a sign-in link to <span className="text-white font-bold">{email}</span>.</p>
          <p>Please check your inbox and click the link to verify your account.</p>
        </motion.div>
        <div className="flex w-full justify-center">
          <Spinner />
        </div>
      </motion.div>
    </>
  );
};
