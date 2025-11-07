import { useLiveEntity } from "@/lib/query-toolkit-v2";
import { streamEntity } from "@/features/streams/entities/stream.entity";

export const useStreamById = (id: string) => {
  return useLiveEntity<Stream, { id: string }>({
    entity: streamEntity,
    queryKey: ["streams", id],
    getParams: () => ({ id }),
    options: {
      enabled: Boolean(id),
    },
  });
};
