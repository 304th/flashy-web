import { api } from "@/services/api";
import { createCollection } from "@/lib/query-toolkit-v2";
import { channelSchema } from "@/features/channels/schemas/channel.schema";

export const profileFollowersCollection = createCollection<
  User,
  { pageParam: number }
>({
  async sourceFrom() {
    return api.get(`users/followerListFull`).json();
  },
  schema: channelSchema,
  name: "profileFollowers",
});
