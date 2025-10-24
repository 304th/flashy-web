import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { topVideosCollection } from "@/features/video/entities/top-videos.collection";

export const useTopVideos = () => {
  return usePartitionedQuery<VideoPost, never>({
    collection: topVideosCollection,
    queryKey: ["video", "top"],
    // getParams: ({ pageParam }) => ({ pageParam }) as any,
  });
};
