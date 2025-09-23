import {createCollection, usePartitionedQuery} from "@/lib/query-toolkit";
import {api} from "@/services/api";
import {socialPostSchema} from "@/features/social/schemas/social-post.schema";
import {decodePollResults} from "@/features/social/utils/poll";

const channelPostsCollection = createCollection<SocialPost, { userId: string; pageParam?: number }>({
  async sourceFrom({ userId }){
    const response = await api.get(`user/${userId}/social-posts`).json<SocialPost[]>();

    //FIXME: refactor backend
    return response.map((socialPost) => ({
      ...socialPost,
      poll: {
        ...socialPost.poll,
        results: decodePollResults(socialPost.poll),
      },
    }));
  },
  schema: socialPostSchema
})

export const useChannelsSocialPosts = ({ userId }: { userId?: string }) => {
  return usePartitionedQuery<SocialPost, { userId: string; pageParam: number }>({
    queryKey: ["channels", userId, 'social'],
    collection: channelPostsCollection,
    getParams: ({ pageParam }) => ({ pageParam, userId: userId! }),
    options: {
      enabled: Boolean(userId),
    },
  });
}