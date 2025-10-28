import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { videosInPlaylist } from "@/features/video/entities/videos-in-playlist.collection";

export interface UpdatePlaylistVideosParams {
  playlistId: string;
  videos: VideoPost[];
}

const updatePlaylistVideosMutation = createMutation<UpdatePlaylistVideosParams>(
  {
    write: async (params) => {
      return api
        .put(`v2/series/updateVideos/${params.playlistId}`, {
          json: {
            videoIds: params.videos.map(video => video.fbId),
          },
        })
        .json();
    },
  },
);

export const useUpdatePlaylistVideos = () => {
  return useOptimisticMutation({
    mutation: updatePlaylistVideosMutation,
    onOptimistic: async (ch, params) => {
      return ch(videosInPlaylist).replaceAll(params.videos);
    },
  });
};
