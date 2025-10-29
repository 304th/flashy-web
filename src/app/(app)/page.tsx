"use client";

import { PlaylistPopularCarousel } from "@/features/video/components/playlists-popular-carousel/playlist-popular-carousel";
import {VideoCarousel} from "@/features/video/components/video-carousel/video-carousel";
import {Loadable} from "@/components/ui/loadable";
import {useMostRecentVideos} from "@/features/video/queries/use-most-recent-videos";

export default function Home() {
  const { data: mostRecentVideos, query } = useMostRecentVideos();

  return (
    <div className="flex flex-col gap-4 w-full">
      <PlaylistPopularCarousel />
      <Loadable queries={[query]}>
        {() => mostRecentVideos ? <VideoCarousel title="Still Hot" videoPosts={mostRecentVideos} /> : null}
      </Loadable>
    </div>
  );
}
