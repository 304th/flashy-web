"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const MobileBlockingBanner = () => {
  const isMobile = useIsMobile();
  const router = useRouter();

  useEffect(() => {
    if (isMobile) {
      router.replace("/mobile");
    }
  }, [isMobile, router]);

  return null;
};
