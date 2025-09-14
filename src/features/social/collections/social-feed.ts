import { api } from "@/services/api";
import { createCollection } from "@/lib/collection";
import { socialPostSchema } from "@/features/social/schemas/social-post.schema";

export const socialFeedCollection = createCollection<
  SocialPost,
  { userId?: string }
>({
  async sourceFrom({ userId } = {}) {
    return await api
      .get(userId ? "relevant-social-posts" : "anonymous/social-posts")
      .json<SocialPost[]>();
  },
  schema: socialPostSchema,
});
