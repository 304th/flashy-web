"use client";

import { Suspense } from "react";
import { useVerificationLinkFound } from "@/features/auth/hooks/use-verification-link-found";

const VerificationProviderContent = () => {
  useVerificationLinkFound();

  return null;
};

export const VerificationProvider = () => {
  return (
    <Suspense fallback={null}>
      <VerificationProviderContent />
    </Suspense>
  );
};
