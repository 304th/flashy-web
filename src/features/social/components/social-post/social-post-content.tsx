import { SocialPostBehindKey } from "@/features/social/components/social-post/social-post-behind-key";
import { SocialPostDescription } from "@/features/social/components/social-post/social-post-description";

export const SocialPostContent = ({
  socialPost,
  className,
}: {
  socialPost: SocialPost;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col gap-3 pt-18 px-4 pb-3 ${className}`}>
      <SocialPostBehindKey socialPost={socialPost} />
      <SocialPostDescription socialPost={socialPost} />
    </div>
  );
};
