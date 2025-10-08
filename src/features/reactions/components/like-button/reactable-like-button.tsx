import { useHasReacted } from "@/features/reactions/hooks/useHasReacted";
import { useReactionsCount } from "@/features/reactions/hooks/useReactionsCount";
import type { LikeButtonButtonRender } from "@/features/reactions/components/like-button/like-button";
import { useAddReaction } from "@/features/reactions/queries/use-add-reaction";
import { useRemoveReaction } from "@/features/reactions/queries/use-remove-reaction";

export interface ReactableLikeButtonProps {
  post: Reactable;
  children: LikeButtonButtonRender;
}

export const ReactableLikeButton = ({
  post,
  children,
}: ReactableLikeButtonProps) => {
  const hasReacted = useHasReacted(post);
  const reactionsCount = useReactionsCount(post);
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();

  return (
    <>
      {children({
        isLiked: hasReacted,
        likesCount: reactionsCount,
        onLike: () => {
          addReaction.mutate({
            id: post._id,
            postType: "social", // FIXME: add logic for other post types
            reactionType: "like",
          });
        },
        onUnlike: () => {
          removeReaction.mutate({
            id: post._id,
            postType: "social", // FIXME: add logic for other post types
            reactionType: "like",
          });
        },
      })}
    </>
  );
};
