import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MiniSocialPost } from "@/features/social/components/featured-social-sidebar/mini-social-post";
import { useMostLikedSocialPosts } from "@/features/social/queries/use-most-liked-social-posts";

export const MostLikedPosts = () => {
  const [mostLikedPosts] = useMostLikedSocialPosts();

  return (
    <AnimatePresence initial={false}>
      {mostLikedPosts && mostLikedPosts.length > 0 && (
        <motion.div
          className="flex flex-col p-4 h-fit w-full gap-2 rounded bg-base-250"
        >
          <p className="text-sm text-base-800">Top 3 Posts</p>
          <div className="flex flex-col gap-3 divide-y">
            {mostLikedPosts.map((socialPost) => (
              <Link key={socialPost._id} href={`/social/post?id=${socialPost._id}`}>
                <MiniSocialPost socialPost={socialPost} />
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
