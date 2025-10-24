import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { videoPostSchema } from "@/features/video/schemas/video-post.schema";

export const topVideosCollection = createCollection<VideoPost>({
  async sourceFrom() {
    const response = await api
      .get("top-videos")
      .json<{ data: { items: VideoPost[] } }>();

    return response.data.items;
  },
  schema: videoPostSchema,
  name: "topVideos",
});
