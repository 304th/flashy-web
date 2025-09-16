import { AnimatePresence, motion } from "framer-motion";
import { useRecentAnnouncements } from "@/features/social/queries/use-recent-announcements";

export const RecentAnnouncements = () => {
  const [recentAnnouncements] = useRecentAnnouncements();

  return <AnimatePresence initial={false}>
    {
      recentAnnouncements && recentAnnouncements.length > 0 && <motion.div className="flex flex-col p-4 gap-3 h-fit w-full transition rounded">

      </motion.div>
    }
  </AnimatePresence>
}