import { api } from "@/services/api";
import { getQuery } from "@/lib/query-toolkit-v2";

export const useLiveStreams = () =>
  getQuery<any[]>(["streams", "live", "all"], async () => {
    const streams = await api.get("streaming/live").json<any[]>();
    return streams || [];
  });
