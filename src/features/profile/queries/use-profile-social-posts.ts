import { createCollection, usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { socialPostSchema } from "@/features/social/schemas/social-post.schema";
import { decodePollResults } from "@/features/social/utils/poll";
import { useAuthed } from "@/features/auth/hooks/use-authed";

const profileSocialPostsCollection = createCollection<
  SocialPost,
  { pageParam?: number }
>({
  async sourceFrom() {
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
  schema: socialPostSchema,
  name: "profileSocialPosts",
});

export const useProfileSocialPosts = () => {
  const authed = useAuthed(); //FIXME: replace with useMe

  return usePartitionedQuery<SocialPost, { pageParam: number }>({
    queryKey: ["me", authed.user?.uid, "social"],
    collection: profileSocialPostsCollection,
    getParams: ({ pageParam }) => ({ pageParam }),
    options: {
      enabled: Boolean(authed.user?.uid),
    },
  });
};
