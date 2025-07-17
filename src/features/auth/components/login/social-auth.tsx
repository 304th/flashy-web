import React from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { GoogleSignIn } from "@/features/auth/components/login/google-signin";
import { defaultVariants } from "@/lib/framer";

export const SocialAuth = () => {
  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={defaultVariants.child}
    >
      <Separator>Or continue with</Separator>
      <div className="flex w-full justify-center">
        <GoogleSignIn />
      </div>
    </motion.div>
  );
};
