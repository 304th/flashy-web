"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@/services/firebase";
import { AnimatePresence, motion } from "framer-motion";
import { CloseButton } from "@/components/ui/close-button";

export const EmailVerificationProvider = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    onAuthStateChanged().then((user) => {
      if (user && !user.emailVerified) {
        setShowWarning(true);
      }
    });
  }, []);

  return (
    <AnimatePresence initial={false}>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 w-full flex justify-center items-center"
        >
          <div
            className="max-w-content flex justify-center items-center p-2 gap-4
              bg-[#ff870580] border"
          >
            <p className="text-white">
              Please check your email to complete the verification process.
            </p>
            <CloseButton onClick={() => setShowWarning(false)} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
