import { AnimatePresence, motion } from "framer-motion";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { VideoPost } from "@/features/video/components/video-post/video-post";

export const VideoFeed = ({
  query,
  videos,
  horizontal,
  className,
}: {
  query: any;
  videos?: Optimistic<VideoPost>[];
  horizontal?: boolean;
  className?: string;
}) => {
  return (
    <Loadable queries={[query as any]} fullScreenForDefaults>
      {() =>
        videos && videos.length > 0 ? (
          <div
            className={`grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 w-full ${className}`}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {!videos?.length ? (
                <NotFound>Videos not found</NotFound>
              ) : (
                videos?.map((videoPost) => (
                  <motion.div
                    key={videoPost._optimisticId || videoPost._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layoutId={`profile-video-${videoPost._optimisticId || videoPost._id}`}
                  >
                    <VideoPost videoPost={videoPost} horizontal={horizontal} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        ) : (
          <NotFound fullWidth>No videos yet</NotFound>
        )
      }
    </Loadable>
  );
};
