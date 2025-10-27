import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { videoPostSchema } from "@/features/video/schemas/video-post.schema";

export interface PlaylistParams {
  channelId: string;
}

export const playlistCollection = createCollection<
  Playlist,
  PlaylistParams
>({
  async sourceFrom(params) {
    return api
      .get("user/series", {
        searchParams: {
          uid: params.channelId,
          seriesType: 'video',
        }
      })
      .json<VideoPost[]>();
  },
  schema: videoPostSchema,
  name: "playlist",
});
