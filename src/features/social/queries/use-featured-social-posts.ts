import {
  FeaturedPosts,
  featuredSocialPostsCollection,
} from "@/features/social/collections/featured-social-posts";
import { useLiveEntity } from "@/lib/query-toolkit/use-live-entity";

export const useFeaturedSocialPosts = () => {
  return useLiveEntity<FeaturedPosts>({
    entity: featuredSocialPostsCollection,
    queryKey: ["social", "featured"],
  });
};
