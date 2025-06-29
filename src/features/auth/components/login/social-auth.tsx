import React from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/icons/google";
import { defaultVariants } from "@/lib/framer";

export const SocialAuth = () => {
  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={defaultVariants.child}
    >
      <Separator>Or continue with</Separator>
      <div className="flex w-full justify-center">
        <Button variant="secondary" className="w-[120px]" size="lg">
          <GoogleIcon />
        </Button>
      </div>
    </motion.div>
  );
};
