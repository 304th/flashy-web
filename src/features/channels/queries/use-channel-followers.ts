import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { channelFollowersCollection } from "@/features/channels/entities/channel-followers.collection";

export const useChannelFollowers = ({ channelId }: { channelId?: string }) => {
  return usePartitionedQuery<User, { pageParam: number; channelId: string }>({
    queryKey: ["channel", channelId, "followers"],
    collection: channelFollowersCollection,
    getParams: ({ pageParam }) => ({ pageParam, channelId: channelId! }) as any,
    options: {
      enabled: Boolean(channelId),
    },
  });
};
