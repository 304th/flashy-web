"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useModals } from "@/hooks/use-modals";

export const useVerificationLinkFound = () => {
  const searchParams = useSearchParams();
  const magicLink = searchParams.get("verified-email");
  const { openModal } = useModals();

  useEffect(() => {
    if (magicLink) {
      setTimeout(() => {
        openModal("MagicLinkVerificationModal");
      }, 100);
    }
  }, [magicLink]);
};
