import { api } from "@/services/api";
import { createEntity } from "@/lib/query-toolkit-v2";

export const boughtKeysEntity = createEntity<string[]>({
  async sourceFrom() {
    return api.get("keys/bought").json<string[]>();
  },
  name: "boughtKeys",
});
