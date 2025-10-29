import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { videoPostSchema } from "@/features/video/schemas/video-post.schema";

export const mostRecentVideosCollection = createCollection<VideoPost>({
  async sourceFrom() {
    const response = await api
      .get("generic/carouselById/stillHot")
      .json<{ list: VideoPost[] }>();

    return response.list;
  },
  schema: videoPostSchema,
  name: "mostRecentVideos",
});
