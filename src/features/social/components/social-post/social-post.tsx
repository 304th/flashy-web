import { UserProfile } from "@/components/ui/user-profile";
import { IconButton } from "@/components/ui/icon-button";
import { ShareIcon } from "@/components/ui/icons/share";
import { SocialPostDescription } from "@/features/social/components/social-post/social-post-description";
import { LikeButton } from "@/features/reactions/components/like-button/like-button";
import { CommentButton } from "@/features/comments/components/comment-button/comment-button";
import { SocialPostMenu } from "@/features/social/components/social-post/social-post-menu";
import { SocialPostTags } from "@/features/social/components/social-post/social-post-tags";
import { SocialPostPoll } from "@/features/social/components/social-post/social-post-poll";
import { SocialPostImages } from "@/features/social/components/social-post/social-post-images";
import { RelightButton } from "@/features/social/components/relight-button/relight-button";
import { useSocialPostContext } from "@/features/social/components/social-post/social-post-context";
import { SocialPostBehindKey } from "@/features/social/components/social-post/social-post-behind-key";
import { timeAgo } from "@/lib/utils";

export const SocialPost = ({
  socialPost,
  className,
}: {
  socialPost: Optimistic<SocialPost>;
  className?: string;
}) => {
  const {
    likeUpdates,
    unlikeUpdates,
    relightUpdates,
    onCommentsOpen,
    onShareOpen,
  } = useSocialPostContext();

  return (
    <div
      className={`relative flex flex-col p-4 gap-3 h-fit w-full transition rounded
        bg-[linear-gradient(180deg,#151515_0%,#151515_0.01%,#19191920_100%)]
        ${className}
        ${socialPost._optimisticStatus === "pending" ? "opacity-50 pointer-events-none" : ""}`}
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
          {/* FIXME: fix this bullshit logic */}
          {onCommentsOpen && <SocialPostMenu socialPost={socialPost} />}
        </div>
      </div>
      {/*<SocialPostBehindKey socialPost={socialPost} />*/}
      <SocialPostDescription socialPost={socialPost} />
      <SocialPostPoll socialPost={socialPost} />
      <SocialPostImages socialPost={socialPost} />
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
      <SocialPostTags socialPost={socialPost} />
    </div>
  );
};
