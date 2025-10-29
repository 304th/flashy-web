import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { decodePollResults } from "@/features/social/utils/poll";
import { socialPostSchema } from "@/features/social/schemas/social-post.schema";

export const channelSocialFeedCollection = createCollection<
  SocialPost,
  { channelId: string; pageParam?: number }
>({
  async sourceFrom({ channelId }) {
    const response = await api
      .get(`user/${channelId}/social-posts`)
      .json<SocialPost[]>();

    //FIXME: refactor backend
    return response.map((socialPost) => ({
      ...socialPost,
      poll: {
        ...socialPost.poll,
        results: decodePollResults(socialPost.poll),
      },
    }));
  },
  schema: socialPostSchema,
  name: "channelSocialFeed",
});
