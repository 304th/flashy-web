import Link from "next/link";
import { UserProfile } from "@/components/ui/user-profile";
import { SocialPostMenu } from "@/features/social/components/social-post/social-post-menu";
import { SocialPostContent } from "@/features/social/components/social-post/social-post-content";
import { SocialPostActions } from "@/features/social/components/social-post/social-post-actions";
import { SocialPostImages } from "@/features/social/components/social-post/social-post-images";
import { SocialPostTags } from "@/features/social/components/social-post/social-post-tags";
import { SocialPostPoll } from "@/features/social/components/social-post/social-post-poll";
import { OptimisticLoading } from "@/features/common/components/optimistic-loading/optimistic-loading";
import { useIsSocialPostLocked } from "@/features/social/hooks/use-is-social-post-locked";
import { timeAgo } from "@/lib/utils";

export const SocialPost = ({
  socialPost,
  isLinkable,
  withMenu,
  className,
}: {
  socialPost: Optimistic<SocialPost>;
  isLinkable?: boolean;
  withMenu?: boolean;
  className?: string;
}) => {
  const isLocked = useIsSocialPostLocked(socialPost);

  return (
    <article
      className={`relative flex flex-col h-fit w-full transition rounded
        bg-[linear-gradient(180deg,#151515_0%,#151515_0.01%,#19191920_100%)]
        ${isLinkable ? "hover:bg-base-200" : ""} ${className}`}
    >
      <UserProfile
        user={{
          fbId: socialPost.userId,
          username: socialPost.username,
          userimage: socialPost.userimage,
        }}
        className="absolute top-4 left-4"
      />
      <div className="absolute top-4 right-4 flex gap-2 items-center">
        <p>{timeAgo(socialPost.createdAt)}</p>
        {withMenu && <SocialPostMenu socialPost={socialPost} />}
      </div>
      {isLinkable && !isLocked ? (
        <Link href={`/social/post?id=${socialPost._id}`}>
          <SocialPostContent socialPost={socialPost} />
        </Link>
      ) : (
        <SocialPostContent socialPost={socialPost} />
      )}
      {!isLocked && (
        <SocialPostPoll socialPost={socialPost} className="px-4 pb-4" />
      )}
      {!isLocked && (
        <SocialPostImages socialPost={socialPost} className="px-4 pb-4" />
      )}
      {!isLocked && (
        <div className="flex flex-col gap-3 px-4 pb-4 bottom-4 w-full">
          <SocialPostActions socialPost={socialPost} />
          <SocialPostTags socialPost={socialPost} />
        </div>
      )}
      <OptimisticLoading entity={socialPost} />
    </article>
  );
};
