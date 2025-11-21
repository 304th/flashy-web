import { toast } from "sonner";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { profileVideoFeedDraftsCollection } from "@/features/profile/entities/profile-video-feed-drafts.collection";
import { profileVideoFeedPublishedCollection } from "@/features/profile/entities/profile-video-feed-published.collection";

export interface UpdateVideoPostParams {
  key: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  series?: string;
  statusweb?: "published" | "draft";
  publishDate?: number;
}

const updateVideoMutation = createMutation<UpdateVideoPostParams, VideoPost>({
  write: async (params) => {
    return api
      .put("v2/story", {
        json: {
          key: params.key,
          title: params.title,
          description: params.description,
          storyImage: params.thumbnail,
          category: params.category,
          series: params.series,
          statusweb: params.statusweb,
          publishDate: params.publishDate,
        },
      })
      .json<VideoPost>();
  },
});

export const useUpdateVideoPost = () => {
  return useOptimisticMutation({
    mutation: updateVideoMutation,
    onOptimistic: async (ch, params) => {
      const applyCommon = (video: VideoPost) => {
        if (params.title) video.title = params.title;
        if (params.description) video.description = params.description;
        if (params.thumbnail) video.storyImage = params.thumbnail;
        if (params.category) video.category = params.category;
        if (params.series) {
          video.playlist = {
            ...video.playlist,
            fbId: params.series,
          } as TODO;
          video.series = params.series;
        }

        if (params.publishDate) video.publishDate = params.publishDate;
      };

      if (params.statusweb === "published") {
        // Move from drafts to published
        await ch(profileVideoFeedDraftsCollection).delete(params.key);

        return ch(profileVideoFeedPublishedCollection).prepend(
          {
            fbId: params.key,
            publishDate: params.publishDate,
            statusweb: "published",
          },
          {
            sync: true,
            syncFn: (video) => {
              return (video as any).story;
            },
          },
        );
      } else if (params.statusweb === "draft") {
        await ch(profileVideoFeedPublishedCollection).delete(params.key);

        return ch(profileVideoFeedDraftsCollection).prepend(
          {
            fbId: params.key,
            statusweb: "draft",
          },
          {
            sync: true,
            syncFn: (video) => {
              return (video as any).story;
            },
          },
        );
      }

      await ch(profileVideoFeedDraftsCollection).update(params.key, (video) =>
        applyCommon(video),
      );

      return ch(profileVideoFeedPublishedCollection).update(
        params.key,
        (video) => applyCommon(video),
      );
    },
    onSuccess: () => {
      toast.success("Video updated");
    },
  });
};
