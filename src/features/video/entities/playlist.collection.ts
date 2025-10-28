import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { playlistSchema } from "@/features/video/schemas/playlist.schema";

export interface PlaylistParams {
  channelId: string;
}

export const playlistCollection = createCollection<Playlist, PlaylistParams>({
  async sourceFrom(params) {
    return api
      .get("user/series", {
        searchParams: {
          uid: params.channelId,
          seriesType: "video",
        },
      })
      .json<Playlist[]>();
  },
  schema: playlistSchema,
  name: "playlist",
});
