import { SocialPostDescription } from "@/features/social/components/social-post/social-post-description";
import { SocialPostPoll } from "@/features/social/components/social-post/social-post-poll";
import { SocialPostImages } from "@/features/social/components/social-post/social-post-images";

export const RecentAnnouncementSocialPost = ({
  socialPost,
}: {
  socialPost: SocialPost;
}) => {
  return (
    <div className="flex flex-col w-full gap-2 py-2">
      <SocialPostDescription socialPost={socialPost} />
      <SocialPostPoll socialPost={socialPost} />
      <SocialPostImages socialPost={socialPost} />
    </div>
  );
};
