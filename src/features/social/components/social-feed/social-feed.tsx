"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SocialPost } from "@/features/social/components/social-post/social-post";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { useModals } from "@/hooks/use-modals";
import Link from "next/link";

export const SocialFeed = () => {
  const [socialPosts, socialPostsQuery] = useSocialPosts();
  const { openModal } = useModals();

  return (
    <div className="flex flex-col gap-3">
      <Loadable queries={[socialPostsQuery as any]} fullScreenForDefaults>
        {() =>
          socialPosts!.length > 0 ? (
            <AnimatePresence initial={false} mode="popLayout">
              {socialPosts?.map((socialPost) => (
                <motion.div
                  key={socialPost._optimisticId || socialPost._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layoutId={`post-${socialPost._optimisticId || socialPost._id}`}
                >
                  <Link href={`/social/post?id=${socialPost._id}`}>
                    <SocialPost
                      key={socialPost._id}
                      socialPost={socialPost}
                      onCommentsOpen={() =>
                        openModal("PostCommentsModal", {
                          post: socialPost,
                        })
                      }
                      onShareOpen={() => openModal("ShareModal", {
                        post: socialPost,
                      })}
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
