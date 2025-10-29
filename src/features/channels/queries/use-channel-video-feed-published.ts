import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { channelVideoFeedPublishedCollection } from "@/features/channels/entities/channel-video-feed-published.collection";

export const useChannelVideoFeedPublished = ({
  channelId,
}: {
  channelId?: string;
}) => {
  return usePartitionedQuery<
    VideoPost,
    { channelId: string; pageParam: number }
  >({
    queryKey: ["channel", channelId, "videos", "published"],
    collection: channelVideoFeedPublishedCollection,
    getParams: ({ pageParam }) => ({ pageParam, channelId: channelId! }),
    options: {
      enabled: Boolean(channelId),
    },
  });
};
