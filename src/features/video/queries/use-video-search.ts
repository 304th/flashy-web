import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import {
  type VideoSearchParams,
  videoSearchCollection,
} from "@/features/video/entities/video-search.collection";

export const useVideoSearch = (searchParams: VideoSearchParams = {}) => {
  return usePartitionedQuery<
    VideoPost,
    VideoSearchParams & { pageParam: number }
  >({
    collection: videoSearchCollection,
    queryKey: ["video", "search", searchParams],
    getParams: ({ pageParam }) => ({ pageParam, ...searchParams }) as any,
  });
};
