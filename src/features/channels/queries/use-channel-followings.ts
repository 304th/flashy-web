import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { channelFollowingsCollection } from "@/features/channels/entities/channel-followings.collection";

export const useChannelFollowings = ({ channelId }: { channelId?: string }) => {
  return usePartitionedQuery<User, { pageParam: number; channelId: string }>({
    queryKey: ["channel", channelId, "followings"],
    collection: channelFollowingsCollection,
    getParams: ({ pageParam }) => ({ pageParam, channelId: channelId! }) as any,
    options: {
      enabled: Boolean(channelId),
    },
  });
};
