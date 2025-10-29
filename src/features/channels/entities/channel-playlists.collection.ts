import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { playlistSchema } from "@/features/video/schemas/playlist.schema";

export const channelPlaylistsCollection = createCollection<
  Playlist,
  { channelId: string; pageParam?: number }
>({
  async sourceFrom(params) {
    const response = await api
      .get(`publicSeries/${params.channelId}`)
      .json<{ series: Playlist[] }>();

    return response.series;
  },
  schema: playlistSchema,
  name: "channelPlaylists",
});
