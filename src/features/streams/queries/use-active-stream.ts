import { api } from "@/services/api";
import { createQuery, useQuery } from "@/lib/query-toolkit-v2";
import type { CreateStreamResponse } from "../mutations/use-create-stream";

const activeStreamQuery = createQuery<CreateStreamResponse | null>({
  read: async () => {
    return api
      .get("streaming/active")
      .json<CreateStreamResponse | null>();
  },
});

export const useActiveStream = () => {
  return useQuery(activeStreamQuery);
};
