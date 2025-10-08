import { SocialPostBehindKey } from "@/features/social/components/social-post/social-post-behind-key";
import { SocialPostDescription } from "@/features/social/components/social-post/social-post-description";

export const SocialPostContent = ({
  socialPost,
}: {
  socialPost: SocialPost;
}) => {
  return (
    <div className="flex flex-col gap-3 pt-18 px-4 pb-3">
      <SocialPostBehindKey socialPost={socialPost} />
      <SocialPostDescription socialPost={socialPost} />
    </div>
  );
};
