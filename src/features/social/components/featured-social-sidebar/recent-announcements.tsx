import { AnimatePresence, motion } from "framer-motion";
import { useRecentAnnouncements } from "@/features/social/queries/use-recent-announcements";
import Link from "next/link";
import { MiniSocialPost } from "@/features/social/components/featured-social-sidebar/mini-social-post";
import { RecentAnnouncementSocialPost } from "@/features/social/components/featured-social-sidebar/recent-announcement-social-post";

export const RecentAnnouncements = () => {
  const [recentAnnouncements] = useRecentAnnouncements();

  return (
    <AnimatePresence initial={false}>
      {recentAnnouncements && recentAnnouncements.length > 0 && (
        <motion.div
          className="flex flex-col p-4 h-fit w-full gap-2 rounded bg-base-250"
        >
          <p className="text-sm text-base-800">Recent Announcements</p>
          <div className="flex flex-col gap-3 divide-y">
            {recentAnnouncements.map((socialPost) => (
              <Link href={`/social/post?id=${socialPost._id}`}>
                <RecentAnnouncementSocialPost
                  key={socialPost._id}
                  socialPost={socialPost}
                />
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
