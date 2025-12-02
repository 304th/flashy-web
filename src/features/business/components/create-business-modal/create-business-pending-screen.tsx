import Lottie from "lottie-react";
import completedAnimation from "@/features/common/assets/completed.json";

export const CreateBusinessPendingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 p-4">
      <div
        className="flex items-center justify-center rounded-full w-[200px]
          aspect-square"
        style={{ background: "url(/images/success-background.png)" }}
      >
        <Lottie
          id="completed"
          animationData={completedAnimation}
          loop={false}
          autoplay={true}
        />
      </div>
      <p className="text-white text-xl font-medium text-center max-w-[70%]">
        Your registration has been successfully submitted and is now pending
        review.
      </p>
    </div>
  );
};
