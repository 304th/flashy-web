import { UserProfile } from "@/components/ui/user-profile";
import { IconButton } from "@/components/ui/icon-button";
import { ShareIcon } from "@/components/ui/icons/share";
import { timeAgo } from "@/lib/utils";
import { MessageIcon } from "@/components/ui/icons/message";
import { LikeButton } from "@/features/common/components/like-button/like-button";
import { CommentButton } from "@/features/common/components/comment-button/comment-button";

export const SocialPost = ({ socialPost }: { socialPost: SocialPost }) => {
  return <div className="flex flex-col p-4 gap-3 h-fit w-[600px] rounded" style={{ background: 'linear-gradient(180deg, #151515 0%, #151515 0.01%, #191919 100%)' }}>
    <div className="flex items-center justify-between">
      <UserProfile user={{
        id: socialPost.userId,
        username: socialPost.username,
        userimage: socialPost.userimage,
      }} />
      <div className="flex items-center">
        {timeAgo(socialPost.updatedAt)}
      </div>
    </div>
    <p className="text-lg">{socialPost.description}</p>
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <CommentButton commentsCount={socialPost.commentsCount} />
        <LikeButton likesCount={socialPost.likesCount} />
      </div>
      <div className="flex gap-2">
        <IconButton>
          <ShareIcon />
        </IconButton>
      </div>
    </div>
  </div>
}