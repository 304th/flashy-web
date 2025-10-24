import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { decodePollResults } from "@/features/social/utils/poll";
import { socialPostSchema } from "@/features/social/schemas/social-post.schema";

export const profileSocialFeedCollection = createCollection<
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
  name: "profileSocialFeed",
});
