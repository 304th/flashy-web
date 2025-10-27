"use client";

import { Loadable } from "@/components/ui/loadable";
import { AnimatePresence, motion } from "framer-motion";
import { SocialPost } from "@/features/social/components/social-post/social-post";
import { NotFound } from "@/components/ui/not-found";
import { useProfileSocialPosts } from "@/features/profile/queries/use-profile-social-posts";

export default function ProfileSocialPage() {
  const { data, query } = useProfileSocialPosts();

  return (
    <div className="flex gap-4 w-full justify-center">
      <div className="flex flex-col gap-4 w-[45%] min-w-[560px]">
        <Loadable queries={[query as any]} fullScreenForDefaults>
          {() =>
            data && data.length > 0 ? (
              <AnimatePresence initial={false} mode="popLayout">
                {data?.map((socialPost) => (
                  <motion.div
                    key={socialPost._optimisticId || socialPost.orderId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layoutId={`profile-post-${socialPost._optimisticId || socialPost.orderId}`}
                  >
                    <SocialPost socialPost={socialPost} isLinkable withMenu />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <NotFound fullWidth>No posts yet</NotFound>
            )
          }
        </Loadable>
      </div>
    </div>
  );
}
