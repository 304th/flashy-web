import { createCollection, usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { useMe } from "@/features/auth/queries/use-me";
import { playlistSchema } from "@/features/video/schemas/playlist.schema";

export interface ProfilePlaylistParams {
  channelId: string;
}

export const profilePlaylistsCollection = createCollection<
  Playlist,
  { pageParam?: number } & ProfilePlaylistParams
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

export const useProfilePlaylists = () => {
  const { data: me } = useMe();

  return usePartitionedQuery<
    Playlist,
    { pageParam: number } & ProfilePlaylistParams
  >({
    queryKey: ["me", me?.fbId, "playlists"],
    collection: profilePlaylistsCollection,
    getParams: ({ pageParam }) => ({ pageParam, channelId: me?.fbId }) as any,
    options: {
      enabled: Boolean(me?.fbId),
    },
  });
};
