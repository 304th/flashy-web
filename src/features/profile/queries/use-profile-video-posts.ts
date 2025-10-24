import { createCollection, usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { useMe } from "@/features/auth/queries/use-me";
import { videoPostSchema } from "@/features/video/schemas/video-post.schema";

const profileVideoPostsCollection = createCollection<
  VideoPost,
  { pageParam?: number }
>({
  async sourceFrom() {
    const response = await api
      .get(`myVideosDrafts`, {
        searchParams: {
          skip: 0,
        },
      })
      .json<{ videos: VideoPost[] }>();

    return response.videos;
  },
  schema: videoPostSchema,
  name: "profileSocialPosts",
});

export const useProfileVideoPosts = () => {
  const { data: me } = useMe();

  return usePartitionedQuery<VideoPost, { pageParam: number }>({
    queryKey: ["me", me?.fbId, "videos"],
    collection: profileVideoPostsCollection,
    getParams: ({ pageParam }) => ({ pageParam }),
    options: {
      enabled: Boolean(me?.fbId),
    },
  });
};
