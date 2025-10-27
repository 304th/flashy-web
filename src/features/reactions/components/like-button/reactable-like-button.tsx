import { useHasReacted } from "@/features/reactions/hooks/useHasReacted";
import { useReactionsCount } from "@/features/reactions/hooks/useReactionsCount";
import type { LikeButtonButtonRender } from "@/features/reactions/components/like-button/like-button";
import { useAddReaction } from "@/features/reactions/queries/use-add-reaction";
import { useRemoveReaction } from "@/features/reactions/queries/use-remove-reaction";

// Type guard to distinguish between SocialPost and VideoPost
const isVideoPost = (post: Reactable): post is VideoPost => {
  return 'videoId' in post && 'hostID' in post;
};

const isSocialPost = (post: Reactable): post is SocialPost => {
  return 'description' in post && 'images' in post;
};

export interface ReactableLikeButtonProps {
  post: Reactable;
  children: LikeButtonButtonRender;
}

const getPostType = (post: Reactable): PostType => {
  if (isVideoPost(post)) {
    return "video";
  }
  if (isSocialPost(post)) {
    return "social";
  }

  return "social";
};

export const ReactableLikeButton = ({
  post,
  children,
}: ReactableLikeButtonProps) => {
  const hasReacted = useHasReacted(post);
  const reactionsCount = useReactionsCount(post);
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();
  const postType = getPostType(post);

  return (
    <>
      {children({
        isLiked: hasReacted,
        likesCount: reactionsCount,
        onLike: () => {
          addReaction.mutate({
            id: post._id,
            postType,
            reactionType: "like",
          });
        },
        onUnlike: () => {
          removeReaction.mutate({
            id: post._id,
            postType,
            reactionType: "like",
          });
        },
      })}
    </>
  );
};
