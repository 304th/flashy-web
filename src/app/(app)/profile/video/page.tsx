"use client";

import { useState } from "react";
import { ProfileVideoTabs } from "@/features/profile/components/profile-video-tabs/profile-video-tabs";
import { VideoFeed } from "@/features/video/components/video-feed/video-feed";
import { useProfileVideoFeedDrafts } from "@/features/profile/queries/use-profile-video-feed-drafts";
import { useProfileVideoFeedPublished } from "@/features/profile/queries/use-profile-video-feed-published";

const videoTabs = [
  {
    key: "published",
    label: "Published",
  },
  {
    key: "draft",
    label: "Drafts",
  },
];

export default function ProfileVideoPage() {
  const [videoTab, setVideoTab] = useState(() => "published");
  const { data: publishedVideos, query: publishedQuery } =
    useProfileVideoFeedPublished(videoTab === "published");
  const { data: draftVideos, query: draftQuery } = useProfileVideoFeedDrafts(
    videoTab === "draft",
  );
  const query = videoTab === "published" ? publishedQuery : draftQuery;
  const videos = videoTab === "published" ? publishedVideos : draftVideos;

  return (
    <div className="flex flex-col gap-4 justify-center w-full">
      <div className="flex w-full justify-center gap-2">
        <ProfileVideoTabs
          currentTab={videoTab}
          tabs={videoTabs}
          onTabChange={setVideoTab}
        />
      </div>
      <div className="flex gap-4 w-full justify-center">
        <div className="flex gap-4 w-full">
          <VideoFeed query={query} videos={videos} />
        </div>
      </div>
    </div>
  );
}
