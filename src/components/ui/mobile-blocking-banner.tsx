"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

type DeviceType = "ios" | "android" | "other";

const getDeviceType = (): DeviceType => {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
};

export const MobileBlockingBanner = () => {
  const isMobile = useIsMobile();
  const [deviceType, setDeviceType] = useState<DeviceType>("other");

  useEffect(() => {
    setDeviceType(getDeviceType());
  }, []);

  if (!isMobile) return null;

  const isIOS = deviceType === "ios";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100">
      <div className="flex flex-col items-center gap-6 p-8 text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-base-300">
          <Smartphone className="w-10 h-10 text-base-600" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white">
            {isIOS ? "Get the App" : "Mobile Coming Soon"}
          </h1>
          <p className="text-base-content/70 max-w-[300px]">
            {isIOS
              ? "Download Flashy Social for the best mobile experience."
              : "We're working hard to bring Flashy Social to mobile devices. Please visit us on a desktop browser for the best experience."}
          </p>
        </div>
        {isIOS && (
          <a
            href="https://apps.apple.com/ca/app/flashy-social/id1215058822"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Download on App Store
          </a>
        )}
      </div>
    </div>
  );
};
