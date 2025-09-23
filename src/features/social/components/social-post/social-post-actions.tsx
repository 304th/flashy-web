import { CommentButton } from "@/features/comments/components/comment-button/comment-button";
import { LikeButton } from "@/features/reactions/components/like-button/like-button";
import { RelightButton } from "@/features/social/components/relight-button/relight-button";
import { IconButton } from "@/components/ui/icon-button";
import { ShareIcon } from "@/components/ui/icons/share";
import { useSocialPostContext } from "@/features/social/components/social-post/social-post-context";
import { useIsSocialPostLocked } from "@/features/social/hooks/use-is-social-post-locked";

export const SocialPostActions = ({
  socialPost,
}: {
  socialPost: SocialPost;
}) => {
  const {
    likeUpdates,
    unlikeUpdates,
    relightUpdates,
    onCommentsOpen,
    onShareOpen,
  } = useSocialPostContext();
  const isLocked = useIsSocialPostLocked(socialPost);

  if (isLocked) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {onCommentsOpen && (
          <CommentButton
            commentsCount={socialPost.commentsCount}
            onComment={() => onCommentsOpen(socialPost._id)}
          />
        )}
        <LikeButton
          post={socialPost}
          likeUpdates={likeUpdates}
          unlikeUpdates={unlikeUpdates}
        />
        <RelightButton post={socialPost} relightUpdates={relightUpdates} />
      </div>
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
  );
};
