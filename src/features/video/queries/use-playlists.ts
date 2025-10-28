import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { playlistCollection } from "@/features/video/entities/playlist.collection";

// export const usePlaylists = () => {
//   return usePartitionedQuery<VideoPost, never>({
//     collection: playlistCollection,
//     queryKey: ["video", "playlists"],
//     // getParams: ({ pageParam }) => ({ pageParam }) as any,
//   });
// };
