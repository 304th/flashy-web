"use client";

import { Loadable } from "@/components/ui/loadable";
import { MostCommentedPosts } from "./most-commented-posts";
import { RecentAnnouncements } from "@/features/social/components/featured-social-sidebar/recent-announcements";
import { MostLikedPosts } from "@/features/social/components/featured-social-sidebar/most-liked-posts";
import { MostRelightedPosts } from "@/features/social/components/featured-social-sidebar/most-relighted-posts";
import { useFeaturedSocialPosts } from "@/features/social/queries/use-featured-social-posts";
import { useStickySidebar } from "@/hooks/use-sticky-sidebar";

export const FeaturedSocialSidebar = () => {
  const { query } = useFeaturedSocialPosts();
  const { ref, position, top } = useStickySidebar({
    topOffset: 16,
    // containerId: 'container',
  });

  return (
    <div className="relative">
      <div
        ref={ref}
        className={"flex flex-col gap-3"}
        style={{ position, top }}
      >
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
    </div>
  );
};
