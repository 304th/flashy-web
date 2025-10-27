import type { ReactNode } from "react";
import { ReactableLikeButton } from "@/features/reactions/components/like-button/reactable-like-button";
import {
  LikeButtonCore,
  LikeButtonCoreProps,
} from "@/features/reactions/components/like-button/like-button-core";
import { LikeableLikeButton } from "@/features/reactions/components/like-button/likeable-like-button";

export const isReactable = (post: any): post is Reactable => {
  return post.reactions;
};

export type LikeButtonButtonRender =
  | ((data: LikeButtonCoreProps) => ReactNode)
  | (() => ReactNode);

export const LikeButton = ({ post, className }: { post: Reactable | Likeable; className?: string }) => {
  if (isReactable(post)) {
    return (
      <ReactableLikeButton post={post}>
        {({ isLiked, likesCount, onLike, onUnlike }) => (
          <LikeButtonCore
            isLiked={isLiked}
            likesCount={likesCount}
            className={className}
            onLike={onLike}
            onUnlike={onUnlike}
          />
        )}
      </ReactableLikeButton>
    );
  }

  return (
    <LikeableLikeButton post={post}>
      {({ isLiked, likesCount, onLike, onUnlike }) => (
        <LikeButtonCore
          isLiked={isLiked}
          likesCount={likesCount}
          className={className}
          onLike={onLike}
          onUnlike={onUnlike}
        />
      )}
    </LikeableLikeButton>
  );
};
