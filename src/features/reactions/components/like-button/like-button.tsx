import Lottie from "lottie-react";
import { usePrevious } from "react-use";
import { HeartIcon } from "@/components/ui/icons/heart";
import { useReactionsCount } from "@/features/reactions/hooks/useReactionsCount";
import { useHasReacted } from "@/features/reactions/hooks/useHasReacted";
import { useAddReaction } from "@/features/reactions/queries/useAddReaction";
import { useRemoveReaction } from "@/features/reactions/queries/useRemoveReaction";
import likeAnimation from "@/features/reactions/assets/like-animation.json";

export const LikeButton = ({
  post,
  onAdd,
  onRemove,
}: {
  post: Reactable;
  onAdd?: (variables: any) => unknown;
  onRemove?: (variables: any) => unknown;
}) => {
  const addReaction = useAddReaction({
    onMutate: onAdd,
  });
  const removeReaction = useRemoveReaction({
    onMutate: onRemove,
  });
  const hasReacted = useHasReacted(post);
  const reactionsCount = useReactionsCount(post);
  const previousHasReacted = usePrevious(hasReacted); //FIXME: Fix this logic

  return (
    <div
      className="group flex items-center gap-1 px-1 py-[2px] rounded-md
        cursor-pointer transition hover:text-[#E03336] hover:bg-[#E0333610]"
      role="button"
      onClick={() => {
        if (hasReacted) {
          removeReaction.mutate({
            id: post._id,
            postType: "social",
            reactionType: "like",
          });
        } else {
          addReaction.mutate({
            id: post._id,
            postType: "social",
            reactionType: "like",
          });
        }
      }}
    >
      {hasReacted ? (
        <Lottie
          animationData={likeAnimation}
          loop={false}
          autoplay={!previousHasReacted && hasReacted}
          style={{
            width: "30px",
            height: "30px",
          }}
        />
      ) : (
        <div className="relative flex rounded-full">
          <HeartIcon />
        </div>
      )}
      <p className="transition">{reactionsCount}</p>
    </div>
  );
};
