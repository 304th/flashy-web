import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import {
  type ProfileStreamsParams,
  profileStreamsCollection,
} from "@/features/profile/entities/profile-streams.collection";

export const useProfileStreams = (params: ProfileStreamsParams) => {
  return usePartitionedQuery<
    Stream,
    ProfileStreamsParams & { pageParam: number }
  >({
    collection: profileStreamsCollection,
    queryKey: ["profile", params.userId, "streams", params.filter || "all"],
    getParams: ({ pageParam }) => ({ pageParam, ...params }) as any,
  });
};
