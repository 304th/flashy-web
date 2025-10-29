import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { videoPostSchema } from "@/features/video/schemas/video-post.schema";

export interface VideosInPlaylistParams {
  playlistId: string;
}

export const videosInPlaylist = createCollection<
  VideoPost,
  VideosInPlaylistParams
>({
  async sourceFrom(params) {
    return api
      .get(`publicSeries/${params.playlistId}/videos`)
      .json<VideoPost[]>();
  },
  schema: videoPostSchema,
  name: "videosInPlaylist",
});
