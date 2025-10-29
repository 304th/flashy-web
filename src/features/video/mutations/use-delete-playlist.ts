import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { profilePlaylistsCollection } from "@/features/profile/entities/profile-playlists.collection";

export interface DeletePlaylistParams {
  id: string; //fbId
}

const playlistDeleteMutation = createMutation<DeletePlaylistParams>({
  write: async (params) => {
    return api.delete(`series/${params.id}`).json();
  },
});

export const useDeletePlaylist = () => {
  return useOptimisticMutation({
    mutation: playlistDeleteMutation,
    onOptimistic: async (ch, params) => {
      return ch(profilePlaylistsCollection).delete(params.id);
    },
  });
};
