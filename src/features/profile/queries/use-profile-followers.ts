import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { profileFollowersCollection } from "@/features/profile/entities/profile-followers.collection";

export const useProfileFollowers = () => {
  const { data: me } = useMe();

  return usePartitionedQuery<User, { pageParam: number }>({
    queryKey: ["me", me?.fbId, "followers"],
    collection: profileFollowersCollection,
    getParams: ({ pageParam }) => ({ pageParam }) as any,
    options: {
      enabled: Boolean(me?.fbId),
    },
  });
};
