import { CommentButton } from "@/features/comments/components/comment-button/comment-button";
import { LikeButton } from "@/features/reactions/components/like-button/like-button";
import { RelightButton } from "@/features/social/components/relight-button/relight-button";
import { IconButton } from "@/components/ui/icon-button";
import { ShareIcon } from "@/components/ui/icons/share";
import { BlazeTipIcon } from "@/components/ui/icons/blaze-tip";
import { useSocialPostContext } from "@/features/social/components/social-post/social-post-context";
import { useIsSocialPostLocked } from "@/features/social/hooks/use-is-social-post-locked";
import { useIsSocialPostOwned } from "@/features/social/hooks/use-is-social-post-owned";
import { useModals } from "@/hooks/use-modals";

export const SocialPostActions = ({
  socialPost,
  className,
}: {
  socialPost: SocialPost;
  className?: string;
}) => {
  const { onCommentsOpen, onShareOpen } = useSocialPostContext();
  const isLocked = useIsSocialPostLocked(socialPost);
  const { openModal } = useModals();
  const isOwned = useIsSocialPostOwned(socialPost);

  if (isLocked) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex gap-2">
        {onCommentsOpen && (
          <CommentButton
            commentsCount={socialPost.commentsCount}
            onComment={() => onCommentsOpen(socialPost._id)}
          />
        )}
        <LikeButton post={socialPost} />
        <RelightButton post={socialPost} />
      </div>
      <div className="flex gap-2 items-center">
        {!isOwned && (
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              openModal("TipModal", {
                user: {
                  fbId: socialPost.userId,
                  username: socialPost.username,
                  userimage: socialPost.userimage,
                },
                post: {
                  type: "post",
                  id: socialPost._id,
                  title: "",
                },
              });
            }}
          >
            <div className="scale-75">
              <BlazeTipIcon />
            </div>
          </IconButton>
        )}
        {onShareOpen && (
          <div className="flex gap-2">
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                onShareOpen(socialPost);
              }}
            >
              <ShareIcon />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};
