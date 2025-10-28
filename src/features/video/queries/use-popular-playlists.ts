import {useLiveQuery} from "@/lib/query-toolkit-v2";
import {popularPlaylistsCollection} from "@/features/video/entities/popular-playlists.collection";

export const usePopularPlaylists = () => {
  return useLiveQuery({
    queryKey: ["popularSeries"],
    collection: popularPlaylistsCollection,
  })
}