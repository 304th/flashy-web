import { api } from "@/services/api";
import { getQuery } from "@/lib/query-toolkit-v2";

export const useStreamById = (streamId: string) =>
  getQuery<Stream>(["streams", streamId], async () => {
    return api.get(`streaming/${streamId}`).json<Stream>();
  });
