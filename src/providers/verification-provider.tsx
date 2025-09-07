'use client';

import { useMagicLinkFound } from "@/features/auth/hooks/use-magic-link-found";

export const VerificationProvider = () => {
  useMagicLinkFound();

  return null
};
