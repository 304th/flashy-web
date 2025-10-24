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
        ) : (
          <NotFound fullWidth>No videos yet</NotFound>
        )
      }
    </Loadable>
  );
};
