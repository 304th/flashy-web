"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Monitor } from "lucide-react";

export const MobileBlockingBanner = () => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100">
      <div className="flex flex-col items-center gap-6 p-8 text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-base-300">
          <Monitor className="w-10 h-10 text-base-600" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white">Mobile Coming Soon</h1>
          <p className="text-base-content/70 max-w-[300px]">
            We&apos;re working hard to bring Flashy Social to mobile devices.
            Please visit us on a desktop browser for the best experience.
          </p>
        </div>
      </div>
    </div>
  );
};
