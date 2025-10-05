"use client";

import { Loadable } from "@/components/ui/loadable";
import { AnimatePresence, motion } from "framer-motion";
import { SocialPost } from "@/features/social/components/social-post/social-post";
import { NotFound } from "@/components/ui/not-found";
import {useChannelSocialPosts} from "@/features/channels/queries/use-channel-social-posts";
import {useChannelContext} from "@/features/profile/components/channel-context/channel-context";

export default function ChannelSocialPage() {
  const { channelId } = useChannelContext()
  const { data, query } = useChannelSocialPosts({ channelId });

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
                    layoutId={`channel-post-${socialPost._optimisticId || socialPost.orderId}`}
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
      </div>
    </div>
  );
}
