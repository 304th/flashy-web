import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { videoPostSchema } from "@/features/video/schemas/video.schema";

export interface VideoSearchParams {
  limit?: number;
  sort?: string;
  onlyFree?: boolean;
}

export const videoSearchCollection = createCollection<VideoPost, VideoSearchParams>(
  {
    async sourceFrom(params) {
      return api
        .get("video", {
          searchParams: params as any,
        })
        .json<VideoPost[]>();
    },
    schema: videoPostSchema,
    name: "videoSearch",
  },
);
