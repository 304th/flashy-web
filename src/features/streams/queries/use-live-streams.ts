import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { liveStreamsCollection } from "@/features/streams/entities/live-streams.collection";

export const useLiveStreams = () => {
  return usePartitionedQuery({
    queryKey: ['streams', 'live'],
    collection: liveStreamsCollection,
  })
}