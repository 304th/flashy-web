import React from "react";
import { motion } from "framer-motion";
// import { Spinner } from "@/components/ui/spinner/spinner";
import { defaultVariants } from "@/lib/framer";

export const VerificationEmailSentScreen = ({ email }: { email: string }) => {
  return (
    <>
      <motion.div
        className="flex flex-col w-full justify-between gap-4"
        variants={defaultVariants.container}
      >
        {/*<motion.p*/}
        {/*  className="text-3xl font-extrabold text-white"*/}
        {/*  variants={defaultVariants.child}*/}
        {/*>*/}
        {/*  Check Your Mailbox*/}
        {/*</motion.p>*/}
        <motion.div variants={defaultVariants.child}>
          <p>
            We've sent you a password reset link to{" "}
            <span className="text-white font-bold">{email}</span>.
          </p>
          <p>
            Please check your inbox and click the link to reset your password.
          </p>
        </motion.div>
        {/*<div className="flex w-full justify-center">*/}
        {/*  <Spinner />*/}
        {/*</div>*/}
      </motion.div>
    </>
  );
};
