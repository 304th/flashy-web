import { AnimatePresence, motion } from "framer-motion";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { VideoPost } from "@/features/video/components/video-post/video-post";

export const VideoFeed = ({
  query,
  videos,
}: {
  query: any;
  videos?: Optimistic<VideoPost>[];
}) => {
  return (
    <Loadable queries={[query as any]} fullScreenForDefaults>
      {() =>
        videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            <AnimatePresence initial={false} mode="popLayout">
              {videos?.map((videoPost) => (
                <motion.div
                  key={videoPost._optimisticId || videoPost._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layoutId={`profile-video-${videoPost._optimisticId || videoPost._id}`}
                >
                  <VideoPost videoPost={videoPost} isLinkable />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <NotFound fullWidth>No videos yet</NotFound>
        )
      }
    </Loadable>
  );
};
