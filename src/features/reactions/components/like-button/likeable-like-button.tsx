import type { LikeButtonButtonRender } from "@/features/reactions/components/like-button/like-button";
import {
  type AddLikeParams,
  useAddLike,
} from "@/features/reactions/queries/use-add-like";
import type { OptimisticUpdate } from "@/lib/query.v3";

export interface LikeableLikeButtonProps {
  post: Likeable;
  likeUpdates?: OptimisticUpdate<AddLikeParams>[];
  unlikeUpdates?: OptimisticUpdate<AddLikeParams>[];
  children: LikeButtonButtonRender;
}

export const LikeableLikeButton = ({
  post,
  likeUpdates,
  unlikeUpdates,
  children,
}: LikeableLikeButtonProps) => {
  const like = useAddLike({ optimisticUpdates: likeUpdates });
  const unlike = useAddLike({ optimisticUpdates: unlikeUpdates });

  return (
    <>
      {children({
        isLiked: post.isLiked,
        likesCount: post.likesCount,
        onLike: () => {
          like.mutate({
            id: post._id,
            isLiked: true,
          });
        },
        onUnlike: () => {
          unlike.mutate({
            id: post._id,
            isLiked: false,
          });
        },
      })}
    </>
  );
};
