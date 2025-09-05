import type {LikeButtonButtonRender} from "@/features/reactions/components/like-button/like-button";
import {useAddLike} from "@/features/reactions/queries/useAddLike";

export interface LikeableLikeButtonProps {
  post: Likeable;
  onAdd?: (variables: any) => unknown;
  onRemove?: (variables: any) => unknown;
  children: LikeButtonButtonRender;
}

export const LikeableLikeButton = ({ post, onAdd, onRemove, children }: LikeableLikeButtonProps) => {
  const like = useAddLike({
    onMutate: onAdd,
  });
  const unlike = useAddLike({
    onMutate: onRemove,
  });

  return <>{children({ isLiked: post.isLiked, likesCount: post.likesCount, onLike: () => {
      like.mutate({
        id: post._id,
        isLiked: true,
      });
    }, onUnlike: () => {
      unlike.mutate({
        id: post._id,
        isLiked: false,
      });
    } })}</>
}