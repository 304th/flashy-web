"use client";

import { SocialPost } from "@/features/social/components/social-post/social-post";
import { useSocialPosts } from "@/features/social/queries/useSocialPosts";
import { Loadable } from "@/components/ui/loadable";
import {NotFound} from "@/components/ui/not-found";

export const SocialFeed = () => {
  const [socialPosts, socialPostsQuery] = useSocialPosts();

  return (
    <div className="flex flex-col gap-3">
      <Loadable queries={[socialPostsQuery as any]} fullScreenForDefaults>
        {() =>
          socialPosts!.length > 0 ?socialPosts?.map((socialPost) => (
            <SocialPost key={socialPost._id} socialPost={socialPost} />
          )) : <NotFound fullWidth>No posts yet</NotFound>
        }
      </Loadable>
    </div>
  );
};
