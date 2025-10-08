import type { LikeButtonButtonRender } from "@/features/reactions/components/like-button/like-button";
import { useAddLike } from "@/features/reactions/queries/use-add-like";

export interface LikeableLikeButtonProps {
  post: Likeable;
  children: LikeButtonButtonRender;
}

export const LikeableLikeButton = ({
  post,
  children,
}: LikeableLikeButtonProps) => {
  const like = useAddLike();
  const unlike = useAddLike();

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
