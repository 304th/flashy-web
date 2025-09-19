import { useSubsetQuery } from "@/lib/query-toolkit";
import { type FeaturedPosts } from "@/features/social/collections/featured-social-posts";

export const useMostCommentedSocialPosts = () => {
  return useSubsetQuery<SocialPost[], FeaturedPosts>({
    key: "mostCommented",
    existingQueryKey: ["social", "featured"],
    selectorFn: (data) => data.mostCommented,
  });
};
