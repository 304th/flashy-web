"use client";

import { VideoSearch } from "@/features/video/components/video-search/video-search";

export default function VideoPage() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-4xl font-bold text-white">Videos</h1>
      <VideoSearch />
    </div>
  );
}
