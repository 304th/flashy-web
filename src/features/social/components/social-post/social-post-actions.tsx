import { CommentButton } from "@/features/comments/components/comment-button/comment-button";
import { LikeButton } from "@/features/reactions/components/like-button/like-button";
import { RelightButton } from "@/features/social/components/relight-button/relight-button";
import { IconButton } from "@/components/ui/icon-button";
import { ShareIcon } from "@/components/ui/icons/share";
import { useSocialPostContext } from "@/features/social/components/social-post/social-post-context";
import { useIsSocialPostLocked } from "@/features/social/hooks/use-is-social-post-locked";
import { useIsSocialPostOwned } from "@/features/social/hooks/use-is-social-post-owned";
import { useModals } from "@/hooks/use-modals";
import { useProtectedAction } from "@/features/auth/hooks/use-protected-action";
import {BoltTipIcon} from "@/components/ui/icons/bolt-tip";

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
  const { requireAuth } = useProtectedAction();

  // Use the original post's data for counts/reactions when this is a relight wrapper
  // but keep the wrapper's _id for mutations (so optimistic updates find the right post)
  const effectivePost = socialPost.relightedPost
    ? {
        ...socialPost.relightedPost,
        _id: socialPost._id,
        // Ensure reactions exists so isReactable() returns true
        reactions: socialPost.relightedPost.reactions || socialPost.reactions || {},
      }
    : socialPost;

  if (isLocked) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex gap-2">
        {onCommentsOpen && (
          <CommentButton
            commentsCount={effectivePost.commentsCount}
            onComment={() => onCommentsOpen(socialPost._id)}
          />
        )}
        <LikeButton post={effectivePost} />
        <RelightButton post={effectivePost} />
      </div>
      <div className="flex gap-2 items-center">
        {!isOwned && (
          <IconButton
            onClick={requireAuth((e) => {
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
            })}
          >
            <div className="scale-75">
              <BoltTipIcon />
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
