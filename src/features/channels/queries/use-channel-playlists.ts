import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { channelPlaylistsCollection } from "@/features/channels/entities/channel-playlists.collection";

export const useChannelPlaylists = ({ channelId }: { channelId?: string }) => {
  return usePartitionedQuery<
    Playlist,
    { pageParam: number; channelId: string }
  >({
    queryKey: ["channel", channelId, "playlists"],
    collection: channelPlaylistsCollection,
    getParams: ({ pageParam }) => ({ pageParam, channelId: channelId! }) as any,
    options: {
      enabled: Boolean(channelId),
    },
  });
};
