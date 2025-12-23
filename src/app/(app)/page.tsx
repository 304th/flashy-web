"use client";

import { PlaylistPopularCarousel } from "@/features/video/components/playlists-popular-carousel/playlist-popular-carousel";
import { VideoCarousel } from "@/features/video/components/video-carousel/video-carousel";
import { StreamCarousel } from "@/features/streams/components/stream-carousel/stream-carousel";
import { HomeBannerSection } from "@/features/home/components/home-banner-section";
import { useMostRecentVideos } from "@/features/video/queries/use-most-recent-videos";
import { useLiveStreams } from "@/features/streams/queries/use-live-streams";

export default function Home() {
  const mostRecentVideos = useMostRecentVideos();
  const liveStreams = useLiveStreams();

  return (
    <div className="flex flex-col gap-4 w-full">
      <PlaylistPopularCarousel />
      <HomeBannerSection />
      <VideoCarousel title="Still Hot" query={mostRecentVideos.query} />
      <StreamCarousel title="Live" query={liveStreams.query} />
    </div>
  );
}
