import { SocialPostBehindKey } from "@/features/social/components/social-post/social-post-behind-key";
import { SocialPostDescription } from "@/features/social/components/social-post/social-post-description";
import { SocialPostPoll } from "@/features/social/components/social-post/social-post-poll";
import { SocialPostImages } from "@/features/social/components/social-post/social-post-images";
import { SocialPostActions } from "@/features/social/components/social-post/social-post-actions";
import { SocialPostTags } from "@/features/social/components/social-post/social-post-tags";

export const SocialPostContent = ({
  socialPost,
}: {
  socialPost: SocialPost;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <SocialPostBehindKey socialPost={socialPost} />
      <SocialPostDescription socialPost={socialPost} />
      <SocialPostPoll socialPost={socialPost} />
      <SocialPostImages socialPost={socialPost} />
      <SocialPostActions socialPost={socialPost} />
      <SocialPostTags socialPost={socialPost} />
    </div>
  );
};
