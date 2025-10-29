import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { profilePlaylistsCollection } from "@/features/profile/entities/profile-playlists.collection";
import { useMe } from "@/features/auth/queries/use-me";

export interface ProfilePlaylistParams {
  channelId: string;
}

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
