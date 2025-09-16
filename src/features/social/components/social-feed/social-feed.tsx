"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SocialPost } from "@/features/social/components/social-post/social-post";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { useModals } from "@/hooks/use-modals";
import {
  useSocialFeedUpdatesOnReactionAdd,
  useSocialFeedUpdatesOnReactionRemove,
} from "@/features/social/hooks/use-social-feed-reaction-updates";
import { useSocialFeedRelightUpdates } from "@/features/social/hooks/use-social-feed-relight-updates";

export const SocialFeed = () => {
  const { data, query } = useSocialPosts();
  const { openModal } = useModals();
  const likeUpdates = useSocialFeedUpdatesOnReactionAdd();
  const unlikeUpdates = useSocialFeedUpdatesOnReactionRemove();
  const relightUpdates = useSocialFeedRelightUpdates();

  return (
    <div className="flex flex-col gap-3">
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
                  layoutId={`post-${socialPost._optimisticId || socialPost.orderId}`}
                >
                  <Link href={`/social/post?id=${socialPost._id}`}>
                    <SocialPost
                      socialPost={socialPost}
                      likeUpdates={likeUpdates}
                      unlikeUpdates={unlikeUpdates}
                      relightUpdates={relightUpdates}
                      onCommentsOpen={() =>
                        openModal("PostCommentsModal", {
                          postId: socialPost._id,
                        })
                      }
                      onShareOpen={() =>
                        openModal("ShareModal", {
                          post: socialPost,
                        })
                      }
                    />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <NotFound fullWidth>No posts yet</NotFound>
          )
        }
      </Loadable>
    </div>
  );
};
