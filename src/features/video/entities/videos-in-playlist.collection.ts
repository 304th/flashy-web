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
    debugger
    const s = await api
      .get(`v2/seriesStories/${params.playlistId}/list`)
      .json<VideoPost[]>();

    debugger
    return s
  },
  schema: videoPostSchema,
  name: "videosInPlaylist",
});
