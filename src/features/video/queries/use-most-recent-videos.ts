import { useLiveQuery } from "@/lib/query-toolkit-v2";
import { mostRecentVideosCollection } from "@/features/video/entities/most-recent-videos.collection";

export const useMostRecentVideos = () => {
  return useLiveQuery({
    queryKey: ["mostRecentVideos"],
    collection: mostRecentVideosCollection,
  });
};
