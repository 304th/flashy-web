import { useLiveQuery } from "@/lib/query-toolkit-v2";
import { mostRecentVideosCollection } from "@/features/video/entities/most-recent-videos.collection";

export const useMostRecentVideos = () => {
  return useLiveQuery({
    queryKey: ["mostRecentVideos"],
    collection: mostRecentVideosCollection,
    options: {
      localStorageCache: {
        enabled: true,
        keyPrefix: "flashy",
        version: 1,
        ttlMs: 60 * 60 * 1000,
        compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
      },
    },
  });
};
