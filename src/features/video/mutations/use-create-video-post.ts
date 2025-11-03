  import { toast } from "sonner";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { profileVideoFeedDraftsCollection } from "@/features/profile/entities/profile-video-feed-drafts.collection";
import { profileVideoFeedPublishedCollection } from "@/features/profile/entities/profile-video-feed-published.collection";

export interface CreateVideoPostParams {
  videoId: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoDuration: number;
  category?: string;
  series?: string;
  price?: number;
  statusweb: "published" | "draft";
  publishDate?: number;
}

const videoCreateMutation = createMutation<CreateVideoPostParams, VideoPost>({
  write: async (params) => {
    return api
      .post("v2/story", {
        json: params,
      })
      .json<VideoPost>();
  },
});

export const useCreateVideoPost = () => {
  const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: videoCreateMutation,
    onOptimistic: async (ch, params) => {
      const optimisticVideoPost = {
        ...params,
        hostID: author!.fbId,
        username: author!.username,
        storyImage: params.thumbnail,
      };

      if (params.statusweb === "draft") {
        return ch(profileVideoFeedDraftsCollection).prepend(
          optimisticVideoPost,
          {
            sync: true,
          },
        );
      }

      return ch(profileVideoFeedPublishedCollection).prepend(
        optimisticVideoPost,
        {
          sync: true,
        },
      );
    },
    onSuccess: (_, __, params) => {
      toast.success(
        `Video successfully ${params.statusweb === "draft" ? "created" : "published"}!`,
      );
    },
  });
};
