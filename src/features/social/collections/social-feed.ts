import { api } from "@/services/api";
import { createCollection as createCollectionV2 } from "@/lib/query-toolkit-v2/collection";
import { socialPostSchema } from "@/features/social/schemas/social-post.schema";
import { decodePollResults } from "@/features/social/utils/poll";

export const socialFeedCollection = createCollectionV2<
  SocialPost,
  { userId?: string; limit: number; skip: number; }
>({
  async sourceFrom({ userId, limit, skip }) {
    const response = await api
      .get(userId ? `relevant-social-posts?limit=${limit}&skip=${skip}` : `anonymous/social-posts?limit=${limit}&skip=${skip}`)
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
  name: "social-posts",
});
