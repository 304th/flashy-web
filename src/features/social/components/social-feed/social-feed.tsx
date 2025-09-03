"use client";

import { SocialPost } from "@/features/social/components/social-post/social-post";
import { useSocialPosts } from "@/features/social/queries/useSocialPosts";

export const SocialFeed = () => {
  const [socialPosts] = useSocialPosts();

  return (
    <div className="flex flex-col gap-3">
      {socialPosts?.map((socialPost) => (
        <SocialPost key={socialPost._id} socialPost={socialPost} />
      ))}
    </div>
  );
};
