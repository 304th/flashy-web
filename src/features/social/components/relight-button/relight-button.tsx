import Lottie from "lottie-react";
import { RelightIcon } from "@/components/ui/icons/bolt-relight";
import { useHasRelighted } from "@/features/social/hooks/use-has-relighted";
import { useRelightSocialPost } from "@/features/social/mutations/use-relight-social-post";
import { useMe } from "@/features/auth/queries/use-me";
import { useRelightsCount } from "@/features/social/hooks/use-relights-count";
import relightAnimation from "@/features/social/assets/relight-animation.json";
import { useProtectedAction } from "@/features/auth/hooks/use-protected-action";

export const RelightButton = ({ post }: { post: Relightable }) => {
  const { data: me } = useMe();
  const isRelighted = useHasRelighted(post);
  const relitsCount = useRelightsCount(post);
  const relightPost = useRelightSocialPost();
  const { requireAuth } = useProtectedAction();

  return (
    <div
      className="group flex rounded-md items-center min-w-14 gap-1 px-1 py-[2px]
        cursor-pointer transition hover:text-brand-100 hover:bg-brand-100/10"
      onClick={requireAuth((e) => {
        e.preventDefault();
        relightPost.mutate({
          id: post._id,
          username: me?.username!,
          isRelighted: !isRelighted,
        });
      })}
    >
      {isRelighted ? (
        <div className="relative flex rounded-full text-brand-100">
          <RelightIcon />
        </div>
      ) : (
        <div className="relative flex rounded-full">
          <RelightIcon />
        </div>
      )}
      <p className={`transition ${isRelighted ? "text-brand-100" : ""}`}>
        {relitsCount}
      </p>
    </div>
  );
};
