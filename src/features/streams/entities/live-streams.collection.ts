import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { streamSchema } from "@/features/streams/schemas/stream.schema";

export const liveStreamsCollection = createCollection<Stream>({
  sourceFrom: async () => api.get("streaming/live").json<Stream[]>(),
  schema: streamSchema,
  name: "liveStreams",
});
