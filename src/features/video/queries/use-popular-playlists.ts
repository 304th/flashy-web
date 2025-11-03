import { useLiveQuery } from "@/lib/query-toolkit-v2";
import { popularPlaylistsCollection } from "@/features/video/entities/popular-playlists.collection";

export const usePopularPlaylists = () => {
  return useLiveQuery({
    queryKey: ["popularSeries"],
    collection: popularPlaylistsCollection,
    options: {
      localStorageCache: {
        enabled: true,
        keyPrefix: 'flashy',
        version: 1,
        ttlMs: 60 * 60 * 1000,
        compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
      }
    }
  });
};
