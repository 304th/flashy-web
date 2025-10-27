"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SocialPost } from "@/features/social/components/social-post/social-post";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { SocialPostProvider } from "@/features/social/components/social-post/social-post-context";
import { InfiniteFeed } from "@/components/ui/infinite-feed";
import { useModals } from "@/hooks/use-modals";

export const SocialFeed = () => {
  const { data, query } = useSocialPosts();
  const { openModal } = useModals();

  return (
    <div className="flex flex-col gap-3">
      <SocialPostProvider
        onCommentsOpen={(postId: string) =>
          openModal("PostCommentsModal", {
            postId: postId,
          })
        }
        onShareOpen={(socialPost: SocialPost) => {
          openModal("ShareModal", {
            id: socialPost._id,
            type: "social",
          });
        }}
      >
        <InfiniteFeed query={query}>
          <Loadable queries={[query as any]} fullScreenForDefaults>
            {() =>
              data!.length > 0 ? (
                <AnimatePresence initial={false} mode="popLayout">
                  {data?.map((socialPost) => (
                    <motion.div
                      key={socialPost._optimisticId || socialPost.orderId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout="position"
                      layoutId={`post-${socialPost._optimisticId || socialPost.orderId}`}
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
        </InfiniteFeed>
      </SocialPostProvider>
    </div>
  );
};
