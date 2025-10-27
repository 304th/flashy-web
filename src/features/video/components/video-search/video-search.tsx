import { useVideoSearch } from "@/features/video/queries/use-video-search";
import { VideoFeed } from "@/features/video/components/video-feed/video-feed";
import {VideoSearchBar} from "@/features/video/components/video-search/video-search-bar";

export const VideoSearch = () => {
  const { data: videos, query } = useVideoSearch();

  return <div className="flex flex-col gap-4 w-full">
    <VideoSearchBar />
    <VideoFeed query={query} videos={videos} />
  </div>
};
