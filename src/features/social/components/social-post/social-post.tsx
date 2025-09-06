import { UserProfile } from "@/components/ui/user-profile";
import { IconButton } from "@/components/ui/icon-button";
import { ShareIcon } from "@/components/ui/icons/share";
import { SocialPostDescription } from "@/features/social/components/social-post/social-post-description";
import { useModals } from "@/hooks/use-modals";
import { LikeButton } from "@/features/reactions/components/like-button/like-button";
import { CommentButton } from "@/features/comments/components/comment-button/comment-button";
import { useAddReactionMutate } from "@/features/social/hooks/useAddReactionMutate";
import { useRemoveReactionMutate } from "@/features/social/hooks/useRemoveReactionMutate";
import { timeAgo } from "@/lib/utils";
import { SocialPostMenu } from "@/features/social/components/social-post/social-post-menu";
import { SocialPostTags } from "@/features/social/components/social-post/social-post-tags";

export const SocialPost = ({
  socialPost,
  className,
}: {
  socialPost: SocialPost;
  className?: string;
}) => {
  const { openModal } = useModals();
  const handleAddMutate = useAddReactionMutate();
  const handleRemoveMutate = useRemoveReactionMutate();

  return (
    <div
      className={`flex flex-col p-4 gap-3 h-fit w-[600px] rounded ${className}`}
      style={{
        background:
          "linear-gradient(180deg, #151515 0%, #151515 0.01%, #191919 100%)",
      }}
    >
      <div className="flex items-center justify-between">
        <UserProfile
          user={{
            fbId: socialPost.userId,
            username: socialPost.username,
            userimage: socialPost.userimage,
          }}
        />
        <div className="flex gap-2 items-center">
          <p>{timeAgo(socialPost.createdAt)}</p>
          <SocialPostMenu socialPost={socialPost} />
        </div>
      </div>
      <SocialPostDescription socialPost={socialPost} />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <CommentButton
            commentsCount={socialPost.commentsCount}
            onComment={() =>
              openModal("PostCommentsModal", {
                post: socialPost,
              })
            }
          />
          <LikeButton
            post={socialPost}
            onAdd={handleAddMutate}
            onRemove={handleRemoveMutate}
          />
        </div>
        <div className="flex gap-2">
          <IconButton>
            <ShareIcon />
          </IconButton>
        </div>
      </div>
      <SocialPostTags socialPost={socialPost} />
    </div>
  );
};
