import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MiniSocialPost } from "@/features/social/components/featured-social-sidebar/mini-social-post";
import { useMostCommentedSocialPosts } from "@/features/social/queries/use-most-commented-social-posts";

export const MostCommentedPosts = () => {
  const [mostCommentedPosts] = useMostCommentedSocialPosts();

  return <AnimatePresence initial={false}>
    {
      mostCommentedPosts && mostCommentedPosts.length > 0 && <motion.div className="flex flex-col p-4 h-fit w-full gap-2 rounded bg-base-250">
        <p className="text-sm text-base-800">Most Commented</p>
        <div className="flex flex-col gap-3 divide-y">
          {
            mostCommentedPosts.map(socialPost => <Link href={`/social/post?id=${socialPost._id}`}><MiniSocialPost key={socialPost._id} socialPost={socialPost} /></Link>)
          }
        </div>

      </motion.div>
    }
  </AnimatePresence>
}