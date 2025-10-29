"use client";

import { PlaylistPopularCarousel } from "@/features/video/components/playlists-popular-carousel/playlist-popular-carousel";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <PlaylistPopularCarousel />
      {/*<StreamBillboard />*/}
    </div>
  );
}
