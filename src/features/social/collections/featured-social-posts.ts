import { api } from "@/services/api";
import { createEntity } from "@/lib/query-toolkit-v2";

export interface FeaturedPosts {
  recentAnnouncements: SocialPost[];
  mostCommented: SocialPost[];
  mostLiked: SocialPost[];
  mostRelighted: SocialPost[];
}

export const featuredSocialPostsCollection = createEntity<FeaturedPosts>({
  async sourceFrom() {
    return api.get("anonymous/social-featured-posts").json<FeaturedPosts>();
  },
  name: "featuredSocialPosts",
});
