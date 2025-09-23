import { UserProfile } from "@/components/ui/user-profile";
import { SocialPostDescription } from "@/features/social/components/social-post/social-post-description";
import { SocialPostMenu } from "@/features/social/components/social-post/social-post-menu";
import { SocialPostTags } from "@/features/social/components/social-post/social-post-tags";
import { SocialPostPoll } from "@/features/social/components/social-post/social-post-poll";
import { SocialPostImages } from "@/features/social/components/social-post/social-post-images";
import { SocialPostActions } from "@/features/social/components/social-post/social-post-actions";
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
  const { onCommentsOpen } = useSocialPostContext();

  return (
    <div
      className={`relative flex flex-col p-4 gap-3 h-fit w-full transition
        rounded
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
      <SocialPostBehindKey socialPost={socialPost} />
      <SocialPostDescription socialPost={socialPost} />
      <SocialPostPoll socialPost={socialPost} />
      <SocialPostImages socialPost={socialPost} />
      <SocialPostActions socialPost={socialPost} />
      <SocialPostTags socialPost={socialPost} />
    </div>
  );
};
