import Lottie from "lottie-react";
import likeAnimation from "@/features/reactions/assets/like-animation.json";
import { HeartIcon } from "@/components/ui/icons/heart";
import { usePrevious } from "react-use";

export interface LikeButtonCoreProps {
  isLiked: boolean;
  likesCount: number;
  onLike: () => void;
  onUnlike: () => void;
}

export const LikeButtonCore = ({
  isLiked,
  likesCount,
  onLike,
  onUnlike,
}: LikeButtonCoreProps) => {
  const previousIsLiked = usePrevious(isLiked); //FIXME: Fix this logic

  return (
    <div
      className="group flex items-center gap-1 px-1 py-[2px] rounded-md
        cursor-pointer transition hover:text-[#E03336] hover:bg-[#E0333610]"
      role="button"
      onClick={(e) => {
        e.preventDefault();
        if (isLiked) {
          onUnlike();
        } else {
          onLike();
        }
      }}
    >
      {isLiked ? (
        <Lottie
          animationData={likeAnimation}
          loop={false}
          autoplay={!previousIsLiked && isLiked}
          style={{
            width: "30px",
            height: "31px",
          }}
        />
      ) : (
        <div className="relative flex rounded-full">
          <HeartIcon />
        </div>
      )}
      <p className="transition">{likesCount}</p>
    </div>
  );
};
