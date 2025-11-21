import { createEntity } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export interface ChannelStreamParams {
  channelId: string;
}

export const channelStreamEntity = createEntity<
  Omit<Stream, "streamKey" | "rtmpUrl">,
  ChannelStreamParams
>({
  sourceFrom: async (params) => {
    return await api.get(`streaming/user/${params?.channelId}`).json();
  },
  name: "channel-stream",
});
