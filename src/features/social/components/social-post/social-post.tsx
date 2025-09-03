import { UserProfile } from "@/components/ui/user-profile";
import { IconButton } from "@/components/ui/icon-button";
import { ShareIcon } from "@/components/ui/icons/share";
import { timeAgo } from "@/lib/utils";
import { LikeButton } from "@/features/reactions/components/like-button/like-button";
import { CommentButton } from "@/features/comments/components/comment-button/comment-button";
import { useAddReactionMutate } from "@/features/social/hooks/useAddReactionMutate";
import { useRemoveReactionMutate } from "@/features/social/hooks/useRemoveReactionMutate";

export const SocialPost = ({ socialPost }: { socialPost: SocialPost }) => {
  const handleAddMutate = useAddReactionMutate();
  const handleRemoveMutate = useRemoveReactionMutate();

  return (
    <div
      className="flex flex-col p-4 gap-3 h-fit w-[600px] rounded"
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
        <div className="flex items-center">
          <p>{timeAgo(socialPost.createdAt)}</p>
        </div>
      </div>
      <p className="text-lg">{socialPost.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <CommentButton commentsCount={socialPost.commentsCount} />
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
    </div>
  );
};
