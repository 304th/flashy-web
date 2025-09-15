import type { ReactNode } from "react";
import { ReactableLikeButton } from "@/features/reactions/components/like-button/reactable-like-button";
import {
  LikeButtonCore,
  LikeButtonCoreProps,
} from "@/features/reactions/components/like-button/like-button-core";
import { LikeableLikeButton } from "@/features/reactions/components/like-button/likeable-like-button";
import { OptimisticUpdate } from "@/lib/query.v3";

export const isReactable = (post: any): post is Reactable => {
  return post.reactions;
};

export type LikeButtonButtonRender =
  | ((data: LikeButtonCoreProps) => ReactNode)
  | (() => ReactNode);

export const LikeButton = ({
  post,
  likeUpdates,
  unlikeUpdates,
}: {
  post: Reactable | Likeable;
  likeUpdates?: OptimisticUpdate<any>[];
  unlikeUpdates?: OptimisticUpdate<any>[];
}) => {
  if (isReactable(post)) {
    return (
      <ReactableLikeButton
        post={post}
        likeUpdates={likeUpdates}
        unlikeUpdates={unlikeUpdates}
      >
        {({ isLiked, likesCount, onLike, onUnlike }) => (
          <LikeButtonCore
            isLiked={isLiked}
            likesCount={likesCount}
            onLike={onLike}
            onUnlike={onUnlike}
          />
        )}
      </ReactableLikeButton>
    );
  }

  return (
    <LikeableLikeButton
      post={post}
      likeUpdates={likeUpdates}
      unlikeUpdates={unlikeUpdates}
    >
      {({ isLiked, likesCount, onLike, onUnlike }) => (
        <LikeButtonCore
          isLiked={isLiked}
          likesCount={likesCount}
          onLike={onLike}
          onUnlike={onUnlike}
        />
      )}
    </LikeableLikeButton>
  );
};
