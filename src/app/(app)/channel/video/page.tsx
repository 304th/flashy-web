"use client";

import { useChannelVideoFeedPublished } from "@/features/channels/queries/use-channel-video-feed-published";
import { useChannelContext } from "@/features/profile/components/channel-context/channel-context";
import { VideoFeed } from "@/features/video/components/video-feed/video-feed";

export default function ChannelSocialPage() {
  const { channelId } = useChannelContext();
  const { data: videos, query } = useChannelVideoFeedPublished({ channelId });

  return (
    <div className="flex flex-col gap-4 justify-center w-full">
      <div className="flex gap-4 w-full justify-center">
        <div className="flex gap-4 w-full">
          <VideoFeed query={query} videos={videos} />
        </div>
      </div>
    </div>
  );
}
