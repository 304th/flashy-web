"use client";

import { Loadable } from "@/components/ui/loadable";
import { MostCommentedPosts } from "./most-commented-posts";
import { RecentAnnouncements } from "@/features/social/components/featured-social-sidebar/recent-announcements";
import { MostLikedPosts } from "@/features/social/components/featured-social-sidebar/most-liked-posts";
import { MostRelightedPosts } from "@/features/social/components/featured-social-sidebar/most-relighted-posts";
import { useFeaturedSocialPosts } from "@/features/social/queries/use-featured-social-posts";

export const FeaturedSocialSidebar = () => {
  const { query } = useFeaturedSocialPosts();

  return (
    <div className="sticky top-0 flex flex-col gap-3 overflow-y-auto">
      <Loadable queries={[query]} fullScreenForDefaults>
        {() => (
          <>
            <RecentAnnouncements />
            <MostLikedPosts />
            <MostCommentedPosts />
            <MostRelightedPosts />
          </>
        )}
      </Loadable>
    </div>
  );
};
