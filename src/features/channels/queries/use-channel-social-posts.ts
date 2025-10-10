import { createCollection, usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { socialPostSchema } from "@/features/social/schemas/social-post.schema";
import { decodePollResults } from "@/features/social/utils/poll";

const channelPostsCollection = createCollection<
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
  name: "channelSocialPosts",
});

export const useChannelSocialPosts = ({
  channelId,
}: {
  channelId?: string;
}) => {
  return usePartitionedQuery<
    SocialPost,
    { channelId: string; pageParam: number }
  >({
    queryKey: ["channel", channelId, "social"],
    collection: channelPostsCollection,
    getParams: ({ pageParam }) => ({ pageParam, channelId: channelId! }),
    options: {
      enabled: Boolean(channelId),
    },
  });
};
