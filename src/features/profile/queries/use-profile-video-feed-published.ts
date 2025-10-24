import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { profileVideoFeedPublishedCollection } from "@/features/profile/entities/profile-video-feed-published.collection";

export const useProfileVideoFeedPublished = (enabled: boolean) => {
  const { data: me } = useMe();

  return usePartitionedQuery<VideoPost, { pageParam: number }>({
    queryKey: ["me", me?.fbId, "videos", "published"],
    collection: profileVideoFeedPublishedCollection,
    getParams: ({ pageParam }) => ({ pageParam }),
    options: {
      enabled: enabled && Boolean(me?.fbId),
    },
  });
};
