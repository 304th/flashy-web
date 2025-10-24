import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { profileVideoFeedDraftsCollection } from "@/features/profile/entities/profile-video-feed-drafts.collection";

export const useProfileVideoFeedDrafts = (enabled?: boolean) => {
  const { data: me } = useMe();

  return usePartitionedQuery<VideoPost, { pageParam: number }>({
    queryKey: ["me", me?.fbId, "videos", "drafts"],
    collection: profileVideoFeedDraftsCollection,
    getParams: ({ pageParam }) => ({ pageParam }),
    options: {
      enabled: enabled && Boolean(me?.fbId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  });
};
