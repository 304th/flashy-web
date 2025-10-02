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
import { useSocialFeedVotePollUpdates } from "@/features/social/hooks/use-social-feed-vote-poll-updates";
import { SocialPostProvider } from "@/features/social/components/social-post/social-post-context";
import { useSocialFeedPinUpdates } from "@/features/social/hooks/use-social-feed-pin-updates";
import { useSocialFeedMuteUpdates } from "@/features/social/hooks/use-social-feed-mute-updates";
import { useSocialFeedUnmuteUpdates } from "@/features/social/hooks/use-social-feed-unmute-updates";

export const SocialFeed = () => {
  const { data, query } = useSocialPosts();
  const likeUpdates = useSocialFeedUpdatesOnReactionAdd();
  const unlikeUpdates = useSocialFeedUpdatesOnReactionRemove();
  const relightUpdates = useSocialFeedRelightUpdates();
  const votePollUpdates = useSocialFeedVotePollUpdates();
  const pinUpdates = useSocialFeedPinUpdates();
  const muteUpdates = useSocialFeedMuteUpdates();
  const unmuteUpdates = useSocialFeedUnmuteUpdates();
  const { openModal } = useModals();

  return (
    <div className="flex flex-col gap-3">
      <SocialPostProvider
        likeUpdates={likeUpdates}
        unlikeUpdates={unlikeUpdates}
        relightUpdates={relightUpdates}
        votePollUpdates={votePollUpdates}
        pinUpdates={pinUpdates}
        muteUpdates={muteUpdates}
        unmuteUpdates={unmuteUpdates}
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
                    <SocialPost socialPost={socialPost} isLinkable />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <NotFound fullWidth>No posts yet</NotFound>
            )
          }
        </Loadable>
      </SocialPostProvider>
    </div>
  );
};
