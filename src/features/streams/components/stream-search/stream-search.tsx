import { StreamFeed } from "@/features/streams/components/stream-feed/stream-feed";
import { StreamSearchBar } from "@/features/streams/components/stream-search/stream-search-bar";
import { useDebouncedSearch } from "@/features/video/hooks/use-debounced-search";
import { useStreamSearch } from "@/features/streams/queries/use-stream-search";

export const StreamSearch = () => {
  const { filters, debouncedFilters, updateFilters, clearFilters } =
    useDebouncedSearch();
  const { data: streams, query } = useStreamSearch(debouncedFilters);

  return (
    <div className="flex flex-col gap-4 w-full">
      <StreamSearchBar
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
      />
      <StreamFeed query={query} streams={streams} />
    </div>
  );
};
