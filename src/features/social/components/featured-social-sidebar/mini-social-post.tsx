import {UserProfile} from "@/components/ui/user-profile";
import {timeAgo} from "@/lib/utils";
import {SocialPostDescription} from "@/features/social/components/social-post/social-post-description";
import {SocialPostPoll} from "@/features/social/components/social-post/social-post-poll";
import {SocialPostImages} from "@/features/social/components/social-post/social-post-images";
import { MiniHeartIcon } from "@/components/ui/icons/mini-heart";
import {MiniMessageIcon} from "@/components/ui/icons/mini-message";
import {MiniRelightIcon} from "@/components/ui/icons/mini-relight";
import {useReactionsCount} from "@/features/reactions/hooks/useReactionsCount";

export const MiniSocialPost = ({ socialPost }: { socialPost: SocialPost }) => {
  const reactionsCount = useReactionsCount(socialPost)

  return <div className="flex flex-col w-full gap-2 py-2">
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
      </div>
    </div>
    <SocialPostDescription socialPost={socialPost} />
    <SocialPostPoll socialPost={socialPost} />
    <SocialPostImages socialPost={socialPost} />
    <div className="flex items-center gap-2 text-base-800">
      <div className="flex items-center gap-1">
        <div className="flex scale-70">
          <MiniHeartIcon />
        </div>
        {reactionsCount?.toLocaleString?.()}
      </div>
      {
        typeof socialPost.commentsCount !== 'undefined' && (
          <div className="flex items-center gap-1">
            <div className="flex scale-70">
              <MiniMessageIcon />
            </div>
            {socialPost.commentsCount.toLocaleString?.()}
          </div>
        )
      }
      <div className="flex items-center gap-1">
        <div className="flex scale-70">
          <MiniRelightIcon />
        </div>
        {socialPost.relitsCount.toLocaleString?.()}
      </div>
    </div>
  </div>
}