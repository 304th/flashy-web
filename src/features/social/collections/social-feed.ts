import { api } from "@/services/api";
import { createCollection } from "@/lib/query-toolkit/collection";
import { createCollection as createCollectionV2 } from "@/lib/query-toolkit-v2/collection";
import { socialPostSchema } from "@/features/social/schemas/social-post.schema";
import { decodePollResults } from "@/features/social/utils/poll";

export const socialFeedCollection = createCollection<
  SocialPost,
  { userId?: string }
>({
  async sourceFrom({ userId } = {}) {
    const response = await api
      .get(userId ? "relevant-social-posts" : "anonymous/social-posts")
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
});

export const socialFeedCollectionV2 = createCollectionV2<
  SocialPost,
  { userId?: string }
>({
  async sourceFrom({ userId } = {}) {
    const response = await api
      .get(userId ? "relevant-social-posts" : "anonymous/social-posts")
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
  name: 'social-posts'
});
