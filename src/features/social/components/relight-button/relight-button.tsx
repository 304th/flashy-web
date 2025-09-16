import Lottie from "lottie-react";
import { RelightIcon } from "@/components/ui/icons/relight";
import { useHasRelighted } from "@/features/social/hooks/use-has-relighted";
import {
  type RelightSocialPostParams,
  useRelightSocialPost,
} from "@/features/social/mutations/use-relight-social-post";
import { useMe } from "@/features/auth/queries/use-me";
import { useRelightsCount } from "@/features/social/hooks/use-relights-count";
import type { OptimisticUpdate } from "@/lib/query-toolkit";
import relightAnimation from "@/features/social/assets/relight-animation.json";

export const RelightButton = ({
  post,
  relightUpdates,
}: {
  post: Relightable;
  relightUpdates?: OptimisticUpdate<RelightSocialPostParams>[];
}) => {
  const [me] = useMe();
  const isRelighted = useHasRelighted(post);
  const relitsCount = useRelightsCount(post);
  const relightPost = useRelightSocialPost({
    optimisticUpdates: relightUpdates,
  });

  return (
    <div
      className="group flex rounded-md items-center min-w-14 gap-1 px-1 py-[2px]
        cursor-pointer transition hover:text-[#FD980F] hover:bg-[#FD980F10]"
      onClick={(e) => {
        e.preventDefault();
        relightPost.mutate({
          id: post._id,
          username: me?.username!,
          isRelighted: !isRelighted,
        });
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
