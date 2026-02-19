"use client";

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

export default function MobilePage() {
  const [deviceType, setDeviceType] = useState<DeviceType>("other");

  useEffect(() => {
    setDeviceType(getDeviceType());
  }, []);

  const isIOS = deviceType === "ios";

  return (
    <div
      className="flex items-center justify-center bg-base-100 min-h-dvh w-full"
    >
      <div className="flex flex-col items-center gap-6 p-8 text-center">
        <div
          className="flex items-center justify-center w-20 h-20 rounded-full
            bg-base-300"
        >
          <Smartphone className="w-10 h-10 text-base-600" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white">
            {isIOS ? "Get the App" : "Mobile Coming Soon"}
          </h1>
          <p className="text-base-content/70 max-w-75">
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-black
              text-white rounded-lg border border-white/20 hover:bg-gray-900
              transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px]">Download on the</span>
              <span className="text-lg font-semibold -mt-1">App Store</span>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
