import Lottie from "lottie-react";
import subscribeAnimation from "@/features/channels/assets/subscribe-explosion.json";
import { useEffect, useRef } from "react";

export const ChannelSubscribeAnimation = ({ play }: { play: boolean }) => {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (play && lottieRef.current) {
      lottieRef.current.goToAndPlay(0, true);
    }
  }, [play]);

  return (
    <div className="absolute inset-0 w-[calc(100% + 1px)] h-[calc(100% + 1px)]">
      <Lottie
        lottieRef={lottieRef}
        id="subscribe-explosion-large"
        animationData={subscribeAnimation}
        loop={false}
        autoplay={false}
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          height: "calc(100%al * 3)",
        }}
      />
      <div
        className="absolute flex justify-center items-center overflow-hidden
          rounded-md pointer-events-none w-full h-full"
      >
        <div
          className={`w-full h-full ${play ? "success-gradient-rotate" : ""}`}
        />
      </div>
      <div
        className="absolute flex justify-center items-center overflow-hidden
          rounded-md opacity-50 pointer-events-none blur-lg w-full h-full"
      >
        <div
          className={`w-full h-full ${play ? "success-gradient-rotate" : ""}`}
        />
      </div>
    </div>
  );
};
