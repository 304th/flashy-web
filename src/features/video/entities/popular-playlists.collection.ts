import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { playlistSchema } from "@/features/video/schemas/playlist.schema";

export const popularPlaylistsCollection = createCollection<Playlist>({
  async sourceFrom() {
    const response = await api
      .get('generic/carouselById/popularSeries')
      .json<{ list: Playlist[] }>();

    return [...response.list, ...response.list, ...response.list, ...response.list];
  },
  schema: playlistSchema,
  name: "popularPlaylists",
});
