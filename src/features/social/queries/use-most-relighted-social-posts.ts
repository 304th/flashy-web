import { useSubsetQuery } from "@/lib/query-toolkit";
import { type FeaturedPosts } from "@/features/social/collections/featured-social-posts";

export const useMostRelightedSocialPosts = () => {
  return useSubsetQuery<SocialPost[], FeaturedPosts>({
    key: "mostRelighted",
    existingQueryKey: ["social", "featured"],
    selectorFn: (data) => data.mostRelighted,
  })
}