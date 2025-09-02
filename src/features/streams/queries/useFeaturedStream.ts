import { api } from "@/services/api";
import { getQuery } from "@/lib/query";

export const useFeaturedStream = () =>
  getQuery<any>(["streams", "live"], async () => {
    const streams = await api.get("stream/live").json<any>()

    return streams?.[0] || null;
  });
