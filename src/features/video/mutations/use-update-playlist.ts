import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { profilePlaylistsCollection } from "@/features/profile/queries/use-profile-playlists";

export interface CreatePlaylistParams {
  playlistId: string;
  title: string;
  description?: string;
  thumbnail: string;
}

const playlistCreateMutation = createMutation<CreatePlaylistParams>({
  write: async (params) => {
    return api
      .put(`v2/series/${params.playlistId}`, {
        json: {
          title: params.title,
          description: params.description,
          seriesImage: params.thumbnail,
        },
      })
      .json();
  },
});

export const useUpdatePlaylist = () => {
  return useOptimisticMutation({
    mutation: playlistCreateMutation,
    onOptimistic: async (ch, params) => {
      return ch(profilePlaylistsCollection).update(
        params.playlistId,
        (playlist) => {
          playlist.title = params.title;
          playlist.description = params.description;
          playlist.image = params.thumbnail;
        },
      );
    },
  });
};
