import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { profilePlaylistsCollection } from "@/features/profile/queries/use-profile-playlists";

export interface UpdatePlaylistVideosParams {
  playlistId: string;
  videoIds: string[];
}

const updatePlaylistVideosMutation = createMutation<UpdatePlaylistVideosParams>({
  write: async (params) => {
    return api.put(`v2/series/updateVideos/${params.playlistId}`, {
      json: {
        videoIds: params.videoIds,
      }
    }).json();
  },
});

export const useUpdatePlaylistVideos = () => {
  return useOptimisticMutation({
    mutation: updatePlaylistVideosMutation,
    // onOptimistic: async (ch, params) => {
    //   return ch(profilePlaylistsCollection).delete(params.playlistId);
    // },
  });
};
