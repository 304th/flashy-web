import { api } from "@/services/api";
import { getQuery } from "@/lib/query";

export const transformLegacyAuthor = (serverAuthor: LegacyAuthor): User => {
  return {
    id: serverAuthor.fbId,
    name: serverAuthor.username,
    avatar: serverAuthor.userimage,
  };
};

export const useFeaturedStream = () =>
  getQuery<any>(["streams", "live"], async () => {
    const stream = (await api.get("stream/live").json<any>())?.[0];

    return stream
      ? {
          ...stream,
          author: transformLegacyAuthor(stream.author),
        }
      : null;
  });
