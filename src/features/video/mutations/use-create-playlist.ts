import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { profilePlaylistsCollection } from "@/features/profile/queries/use-profile-playlists";
import { useMe } from "@/features/auth/queries/use-me";

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
          serieType: "video",
        },
      })
      .json();
  },
});

export const useCreatePlaylist = () => {
  const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: playlistCreateMutation,
    onOptimistic: async (ch, params) => {
      return ch(profilePlaylistsCollection).prepend(
        {
          ...params,
          image: params.thumbnail,
          hostID: author!.fbId,
          username: author!.username,
          userimage: author!.userimage,
        },
        {
          sync: true,
        },
      );
    },
  });
};
