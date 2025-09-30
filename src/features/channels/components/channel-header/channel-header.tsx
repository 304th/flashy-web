"use client";

import { Suspense } from "react";
import { ChannelHeaderBanner } from "@/features/channels/components/channel-header/channel-header-banner";
import { ChannelHeaderUserBar } from "@/features/channels/components/channel-header/channel-header-user-bar";
import { GradualBlurMemo as GradualBlur } from "@/components/ui/gradual-blur/gradual-blur";

export const ChannelHeader = () => {
  return (
    <div
      className="relative flex flex-col w-full h-[390px] bg-base-400 rounded-md
        overflow-hidden"
    >
      <ChannelHeaderBanner />
      <div className="absolute w-full bottom-0">
        <Suspense>
          <GradualBlur
            target="parent"
            position="bottom"
            height="10rem"
            strength={4}
            divCount={2}
            curve="bezier"
            exponential={true}
            opacity={1}
            zIndex={1}
          />
        </Suspense>
        <ChannelHeaderUserBar className="relative z-[2]" />
      </div>
    </div>
  );
};
