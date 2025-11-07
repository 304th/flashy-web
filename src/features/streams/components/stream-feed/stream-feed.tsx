import { AnimatePresence, motion } from "framer-motion";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { StreamCardV2 } from "@/features/streams/components/stream-card-v2/stream-card-v2";

export const StreamFeed = ({
  query,
  streams,
  horizontal,
  className,
}: {
  query: any;
  streams?: Optimistic<Stream>[];
  horizontal?: boolean;
  className?: string;
}) => {
  return (
    <Loadable queries={[query as any]} fullScreenForDefaults>
      {() =>
        streams && streams.length > 0 ? (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              xl:grid-cols-4 gap-4 w-full ${className}`}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {!streams?.length ? (
                <NotFound>Streams not found</NotFound>
              ) : (
                streams?.map((stream) => (
                  <motion.div
                    key={stream._optimisticId || stream._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layoutId={`stream-feed-${stream._optimisticId || stream._id}`}
                  >
                    <StreamCardV2 stream={stream} horizontal={horizontal} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        ) : (
          <NotFound fullWidth>No streams found</NotFound>
        )
      }
    </Loadable>
  );
};
