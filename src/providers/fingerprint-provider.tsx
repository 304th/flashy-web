"use client";

import { useEffect } from "react";
import { useFingerprint } from "@/features/auth/queries/use-fingerprint";

export const FingerprintProvider = () => {
  const [visitorId] = useFingerprint();

  useEffect(() => {
    if (visitorId) {
      localStorage.setItem("visitorId", visitorId);
    }
  }, [visitorId]);

  return null;
};
