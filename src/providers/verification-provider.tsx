"use client";

import { useVerificationLinkFound } from "@/features/auth/hooks/use-verification-link-found";

export const VerificationProvider = () => {
  useVerificationLinkFound();

  return null;
};
