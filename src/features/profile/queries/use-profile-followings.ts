import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { profileFollowingsCollection } from "@/features/profile/entities/profile-followings.collection";

export const useProfileFollowings = () => {
  const { data: me } = useMe();

  return usePartitionedQuery<
    User,
    { pageParam: number }
  >({
    queryKey: ["me", me?.fbId, "followings"],
    collection: profileFollowingsCollection,
    getParams: ({ pageParam }) => ({ pageParam }) as any,
    options: {
      enabled: Boolean(me?.fbId),
    },
  });
};
