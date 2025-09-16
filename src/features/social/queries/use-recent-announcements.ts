import {useSubsetQuery} from "@/lib/query-toolkit";
import {type FeaturedPosts} from "@/features/social/collections/featured-social-posts";

export const useRecentAnnouncements = () => {
  return useSubsetQuery<SocialPost[], FeaturedPosts>({
    key: 'recentAnnouncements',
    existingQueryKey: ["social", "featured"],
    selectorFn: (data) => data.recentAnnouncements,
  })
}