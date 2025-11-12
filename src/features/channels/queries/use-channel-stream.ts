import { useLiveEntity } from "@/lib/query-toolkit-v2";
import {
  channelStreamEntity,
  ChannelStreamParams,
} from "@/features/channels/entities/channel-stream.entity";

export const useChannelStream = ({
  channelId,
}: {
  channelId?: string;
}) => {
  return useLiveEntity<Stream, ChannelStreamParams>({
    entity: channelStreamEntity,
    queryKey: ["channels", channelId, "stream"],
    getParams: () => ({ channelId }) as TODO,
    options: {
      enabled: Boolean(channelId),
    },
  });
};
