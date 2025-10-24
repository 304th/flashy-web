import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { useVideoSearch } from "@/features/video/queries/use-video-search";
import { VideoFeed } from "@/features/video/components/video-feed/video-feed";

export const VideoSearch = () => {
  const { data: videos, query } = useVideoSearch();

  return <VideoFeed query={query} videos={videos} />;
};
