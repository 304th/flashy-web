import { useSubsetQuery } from "@/lib/query-toolkit";
import { type FeaturedPosts } from "@/features/social/collections/featured-social-posts";

export const useMostLikedSocialPosts = () => {
  return useSubsetQuery<SocialPost[], FeaturedPosts>({
    key: "mostLiked",
    existingQueryKey: ["social", "featured"],
    selectorFn: (data) => data.recentAnnouncements,
  });
};
