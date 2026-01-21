"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SocialPost } from "@/features/social/components/social-post/social-post";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { SocialPostProvider } from "@/features/social/components/social-post/social-post-context";
import { InfiniteFeed } from "@/components/ui/infinite-feed";
import { useModals } from "@/hooks/use-modals";
import { useScrollToLastPost } from "@/hooks/use-scroll-restoration";

export const SocialFeed = () => {
  const { data, query } = useSocialPosts();
  const { openModal } = useModals();
  const [isContentReady, setIsContentReady] = useState(false);

  // Mark content as ready after posts are rendered
  useEffect(() => {
    if (query.isSuccess && (data?.length ?? 0) > 0) {
      requestAnimationFrame(() => {
        setIsContentReady(true);
      });
    }
  }, [query.isSuccess, data?.length]);

  // Scroll to last clicked post when navigating back
  const { saveLastClickedPost } = useScrollToLastPost({
    ready: isContentReady,
  });

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
                      data-post-id={socialPost._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout="position"
                      layoutId={`post-${socialPost._optimisticId || socialPost.orderId}`}
                      onClick={() => saveLastClickedPost(socialPost._id)}
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
