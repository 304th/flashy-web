import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { videoPostSchema } from "@/features/video/schemas/video-post.schema";

export const channelVideoFeedPublishedCollection = createCollection<
  VideoPost,
  { channelId: string; pageParam?: number }
>({
  async sourceFrom(params) {
    const response = await api
      .get(`publicVideos/${params.channelId}`, {
        searchParams: {
          skip: 0,
        },
      })
      .json<{ videos: VideoPost[] }>();

    return response.videos;
  },
  schema: videoPostSchema,
  name: "channelVideoFeedPublished",
});
