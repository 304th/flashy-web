import { useVideoSearch } from "@/features/video/queries/use-video-search";
import { VideoFeed } from "@/features/video/components/video-feed/video-feed";
import { VideoSearchBar } from "@/features/video/components/video-search/video-search-bar";
import { useDebouncedSearch } from "@/features/video/hooks/use-debounced-search";

export const VideoSearch = () => {
  const { filters, debouncedFilters, updateFilters, clearFilters } =
    useDebouncedSearch();
  const { data: videos, query } = useVideoSearch(debouncedFilters);

  return (
    <div className="flex flex-col gap-4 w-full">
      <VideoSearchBar
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
      />
      <VideoFeed query={query} videos={videos} />
    </div>
  );
};
