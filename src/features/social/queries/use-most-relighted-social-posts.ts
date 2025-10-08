import { type FeaturedPosts } from "@/features/social/collections/featured-social-posts";
import { useViewQuery } from "@/lib/query-toolkit-v2";

export const useMostRelightedSocialPosts = () => {
  return useViewQuery<SocialPost[], FeaturedPosts>({
    queryKey: ["social", "featured"],
    select: (data) => data.mostRelighted,
  });
};
