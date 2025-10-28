import { useLiveQuery } from "@/lib/query-toolkit-v2";
import { videosInPlaylist } from "@/features/video/entities/videos-in-playlist.collection";

export const useVideosInPlaylist = (playlistId: string) => {
  return useLiveQuery({
    queryKey: ["videos", "playlist", playlistId],
    collection: videosInPlaylist,
    options: {
      enabled: Boolean(playlistId),
    },
  });
};
