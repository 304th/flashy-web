import { api } from "@/services/api";
import { createCollection } from "@/lib/query-toolkit-v2";
import { playlistSchema } from "@/features/video/schemas/playlist.schema";

export const profilePlaylistsCollection = createCollection<
  Playlist,
  { pageParam?: number; channelId: string }
>({
  async sourceFrom(params) {
    return api
      .get(`user/series`, {
        searchParams: {
          uid: params.channelId,
          seriesType: "video",
        },
      })
      .json();
  },
  schema: playlistSchema,
  name: "profilePlaylists",
});