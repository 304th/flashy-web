import Lottie from "lottie-react";
import {RelightIcon} from "@/components/ui/icons/relight";
import {useHasRelighted} from "@/features/social/hooks/use-has-relighted";
import { type RelightSocialPostParams, useRelightSocialPost } from "@/features/social/queries/use-relight-social-post";
import relightAnimation from "@/features/social/assets/relight-animation.json";
import {useRelightsCount} from "@/features/social/hooks/use-relights-count";

export const RelightButton = ({
  post,
  onRelight,
}: {
  post: Relightable;
  onRelight?: (variables: RelightSocialPostParams) => unknown;
}) => {
  const isRelighted = useHasRelighted(post);
  const relitsCount = useRelightsCount(post);
  const relightPost = useRelightSocialPost({
    onMutate: onRelight,
  });

  return (
    <div
      className="group flex rounded-md items-center gap-1 px-1 py-[2px]
        cursor-pointer transition hover:text-[#FD980F] hover:bg-[#FD980F10]"
      onClick={() => {
        relightPost.mutate({
          id: post._id,
          isRelighted: !isRelighted,
        })
      }}
    >
      {isRelighted ? (
        <Lottie
          animationData={relightAnimation}
          loop={false}
          autoplay={true}
          style={{
            width: "30px",
            height: "31px",
          }}
        />
      ) : (
        <div className="relative flex rounded-full">
          <RelightIcon />
        </div>
      )}
      <p className="transition">{relitsCount}</p>
    </div>
  );
};
