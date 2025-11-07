import { createEntity } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export const streamEntity = createEntity<Stream, { id: string }>({
  sourceFrom: async (params) => {
    return await api.get(`streaming/${params?.id!}`).json<Stream>();
  },
  name: "stream",
});
