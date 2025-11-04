"use client";

import { PlaylistPopularCarousel } from "@/features/video/components/playlists-popular-carousel/playlist-popular-carousel";
import { VideoCarousel } from "@/features/video/components/video-carousel/video-carousel";
import { useMostRecentVideos } from "@/features/video/queries/use-most-recent-videos";

export default function Home() {
  const mostRecentVideos = useMostRecentVideos();

  return (
    <div className="flex flex-col gap-4 w-full">
      <PlaylistPopularCarousel />
      <VideoCarousel title="Still Hot" query={mostRecentVideos.query} />
    </div>
  );
}
