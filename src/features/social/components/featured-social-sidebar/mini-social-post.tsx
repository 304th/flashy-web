import Link from "next/link";
import { UserProfile } from "@/components/ui/user-profile";
import { timeAgo } from "@/lib/utils";
import { SocialPostDescription } from "@/features/social/components/social-post/social-post-description";
import { SocialPostPoll } from "@/features/social/components/social-post/social-post-poll";
import { SocialPostImages } from "@/features/social/components/social-post/social-post-images";
import { MiniHeartIcon } from "@/components/ui/icons/mini-heart";
import { MiniMessageIcon } from "@/components/ui/icons/mini-message";
import { MiniRelightIcon } from "@/components/ui/icons/mini-relight";
import { useReactionsCount } from "@/features/reactions/hooks/useReactionsCount";
import { useIsSocialPostLocked } from "@/features/social/hooks/use-is-social-post-locked";
import { SocialPostContent } from "@/features/social/components/social-post/social-post-content";

//FIXME: do the same as main SocialPost (image click triggers page loading animation)
export const MiniSocialPost = ({ socialPost }: { socialPost: SocialPost }) => {
  const reactionsCount = useReactionsCount(socialPost);
  const isLocked = useIsSocialPostLocked(socialPost);

  return (
    <div className="relative flex flex-col w-full gap-2 py-2">
      <UserProfile
        user={{
          fbId: socialPost.userId,
          username: socialPost.username,
          userimage: socialPost.userimage,
        }}
        className="absolute top-4 left-1"
      />
      <div className="absolute top-4 right-1 flex gap-2 items-center">
        <p>{timeAgo(socialPost.createdAt)}</p>
      </div>
      <Link href={`/social/post?id=${socialPost._id}`}>
        <SocialPostContent
          socialPost={socialPost}
          className="!px-1 !pt-16 !pb-0"
        />
      </Link>
      {!isLocked && (
        <SocialPostPoll socialPost={socialPost} className="px-4 pb-4" />
      )}
      {!isLocked && (
        <SocialPostImages socialPost={socialPost} className="px-4 pb-4" />
      )}
      <div className="flex items-center gap-2 text-base-800">
        <div className="flex items-center gap-1">
          <div className="flex scale-70">
            <MiniHeartIcon />
          </div>
          {reactionsCount?.toLocaleString?.()}
        </div>
        {typeof socialPost.commentsCount !== "undefined" && (
          <div className="flex items-center gap-1">
            <div className="flex scale-70">
              <MiniMessageIcon />
            </div>
            {socialPost.commentsCount.toLocaleString?.()}
          </div>
        )}
        <div className="flex items-center gap-1">
          <div className="flex scale-70">
            <MiniRelightIcon />
          </div>
          {socialPost.relitsCount.toLocaleString?.()}
        </div>
      </div>
    </div>
  );
};
