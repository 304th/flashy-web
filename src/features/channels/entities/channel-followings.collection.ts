import { api } from "@/services/api";
import { createCollection } from "@/lib/query-toolkit-v2";
import { channelSchema } from "@/features/channels/schemas/channel.schema";

export const channelFollowingsCollection = createCollection<
  User,
  { channelId: string; pageParam?: number }
>({
  async sourceFrom(params) {
    return api.get(`users/followingListFull/${params.channelId}`).json();
  },
  schema: channelSchema,
  name: "channelFollowings",
});
