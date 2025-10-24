import { useLiveEntity } from "@/lib/query-toolkit-v2";
import { videoPostEntity } from "@/features/video/entities/video-post.entity";

export const useVideoPostById = (id: string) => {
  return useLiveEntity<VideoPost, { id: string }>({
    entity: videoPostEntity,
    queryKey: ["video", id],
    getParams: () => ({ id }),
    options: {
      enabled: Boolean(id),
    },
  });
};
