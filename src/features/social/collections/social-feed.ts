import { api } from "@/services/api";
import { createCollection as createCollectionV2 } from "@/lib/query-toolkit-v2/collection";
import { socialPostSchema } from "@/features/social/schemas/social-post.schema";
import { decodePollResults } from "@/features/social/utils/poll";

// Response type from cursor-based API
interface SocialFeedResponse {
  posts: SocialPost[];
  nextCursor: number | null;
  hasMore: boolean;
}

// Extended array type with cursor info
export type SocialPostPage = SocialPost[] & {
  nextCursor?: number | null;
  hasMore?: boolean;
};

export const socialFeedCollection = createCollectionV2<
  SocialPost,
  { userId?: string; limit: number; cursor: number | null }
>({
  async sourceFrom({ userId, limit, cursor }) {
    const cursorParam = cursor ? `&cursor=${cursor}` : "";
    const response = await api
      .get(
        userId
          ? `user/kfZy3OXJg8eLtQhgbXOun7IB9AP2/relevant-social-posts?limit=${limit}${cursorParam}`
          : `anonymous/social-posts?limit=${limit}${cursorParam}`,
      )
      .json<SocialFeedResponse>();

    // Process posts with poll decoding
    const posts: SocialPostPage = response.posts.map((socialPost) => ({
      ...socialPost,
      poll: {
        ...socialPost.poll,
        results: decodePollResults(socialPost.poll),
      },
    }));

    // Attach cursor info to the array for pagination
    posts.nextCursor = response.nextCursor;
    posts.hasMore = response.hasMore;

    return posts;
  },
  schema: socialPostSchema,
  name: "social-posts",
});
