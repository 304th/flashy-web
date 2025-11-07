import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { streamSchema } from "@/features/streams/schemas/stream.schema";

export interface StreamSearchParams {
  search?: string;
  limit?: number;
  sort?: string;
}

export const streamSearchCollection = createCollection<
  Stream,
  StreamSearchParams
>({
  async sourceFrom(params) {
    return api
      .get("streaming/search", {
        searchParams: params as any,
      })
      .json<Stream[]>();
  },
  schema: streamSchema,
  name: "streamSearch",
});
