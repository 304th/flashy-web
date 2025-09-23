import {createCollection, usePartitionedQuery} from "@/lib/query-toolkit";
import {api} from "@/services/api";
import {socialPostSchema} from "@/features/social/schemas/social-post.schema";
import {decodePollResults} from "@/features/social/utils/poll";
import {useAuthedUser} from "@/features/auth/hooks/use-authed-user";

const profilePostsCollection = createCollection<SocialPost, { pageParam?: number }>({
  async sourceFrom(){
    const response = await api.get(`me/social-posts`).json<SocialPost[]>();

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

export const useProfileSocialPosts = () => {
  const currentUser = useAuthedUser();

  return usePartitionedQuery<SocialPost, { pageParam: number }>({
    queryKey: ["me", currentUser?.uid, 'social'],
    collection: profilePostsCollection,
    getParams: ({ pageParam }) => ({ pageParam }),
    options: {
      enabled: Boolean(currentUser),
    },
  });
}