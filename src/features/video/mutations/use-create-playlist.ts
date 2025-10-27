import {createMutation, useOptimisticMutation} from "@/lib/query-toolkit-v2";
import {api} from "@/services/api";
import {profilePlaylistsCollection} from "@/features/profile/queries/use-profile-playlists";

export interface CreatePlaylistParams {
  title: string;
  description?: string;
  thumbnail: string;
}

const playlistCreateMutation = createMutation<CreatePlaylistParams>({
  write: async (params) => {
    return api
      .post("v2/series", {
        json: {
          title: params.title,
          description: params.description,
          seriesImage: params.thumbnail,
          serieType: 'video',
        },
      })
      .json();
  },
});

export const useCreatePlaylist = () => {
  return useOptimisticMutation({
    mutation: playlistCreateMutation,
    onOptimistic: async (ch, params) => {
      return ch(profilePlaylistsCollection).prepend(params);
    }
  })
}