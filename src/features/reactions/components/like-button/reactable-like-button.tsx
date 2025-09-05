import {useHasReacted} from "@/features/reactions/hooks/useHasReacted";
import {useReactionsCount} from "@/features/reactions/hooks/useReactionsCount";
import type {LikeButtonButtonRender} from "@/features/reactions/components/like-button/like-button";
import {useAddReaction} from "@/features/reactions/queries/useAddReaction";
import {useRemoveReaction} from "@/features/reactions/queries/useRemoveReaction";

export interface ReactableLikeButtonProps {
  post: Reactable;
  onAdd?: (variables: any) => unknown;
  onRemove?: (variables: any) => unknown;
  children: LikeButtonButtonRender;
}

export const ReactableLikeButton = ({ post, onAdd, onRemove, children }: ReactableLikeButtonProps) => {
  const hasReacted = useHasReacted(post);
  const reactionsCount = useReactionsCount(post);
  const addReaction = useAddReaction({
    onMutate: onAdd,
  });
  const removeReaction = useRemoveReaction({
    onMutate: onRemove,
  });

  return <>{children({ isLiked: hasReacted, likesCount: reactionsCount, onLike: () => {
      addReaction.mutate({
        id: post._id,
        postType: "social",// FIXME: add logic for other post types
        reactionType: "like",
      });
    }, onUnlike: () => {
      removeReaction.mutate({
        id: post._id,
        postType: "social",// FIXME: add logic for other post types
        reactionType: "like",
      });
    } })}</>
}