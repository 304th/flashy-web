import { useHasReacted } from "@/features/reactions/hooks/useHasReacted";
import { useReactionsCount } from "@/features/reactions/hooks/useReactionsCount";
import type { LikeButtonButtonRender } from "@/features/reactions/components/like-button/like-button";
import {
  type AddReactionParams,
  useAddReactionV2,
} from "@/features/reactions/queries/use-add-reaction";
import {
  type RemoveReactionParams,
  useRemoveReactionV2,
} from "@/features/reactions/queries/use-remove-reaction";
import type { OptimisticUpdate } from "@/lib/query-toolkit";

export interface ReactableLikeButtonProps {
  post: Reactable;
  likeUpdates?: OptimisticUpdate<AddReactionParams>[];
  unlikeUpdates?: OptimisticUpdate<RemoveReactionParams>[];
  children: LikeButtonButtonRender;
}

export const ReactableLikeButton = ({
  post,
  likeUpdates,
  unlikeUpdates,
  children,
}: ReactableLikeButtonProps) => {
  const hasReacted = useHasReacted(post);
  const reactionsCount = useReactionsCount(post);
  const addReaction = useAddReactionV2();
  const removeReaction = useRemoveReactionV2();

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
