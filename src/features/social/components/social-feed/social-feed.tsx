"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SocialPost } from "@/features/social/components/social-post/social-post";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { useModals } from "@/hooks/use-modals";
import Link from "next/link";
import { createOptimisticSocialPost } from "@/features/social/utils/createOptimisticSocialPost";
import { useMe } from "@/features/auth/queries/use-me";
import { Button } from "@/components/ui/button";

export const SocialFeed = () => {
  const [me] = useMe();
  const { data, query, updates } = useSocialPosts();
  const { openModal } = useModals();

  const addPost = async () => {
    await updates.prepend({
      description: "asdasd",
      images: [],
      userId: me?.fbId!,
      username: me?.username!,
      userimage: me?.userimage!,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Button onClick={() => addPost()}>Add post</Button>
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
                      onCommentsOpen={() =>
                        openModal("PostCommentsModal", {
                          post: socialPost,
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
