import { api } from "@/services/api";
import { createCollection } from "@/lib/query-toolkit-v2";
import { keySchema } from "@/features/keys/schemas/key.schema";

export const boughtKeysCollections = createCollection<Key>({
  async sourceFrom() {
    return api.get("keys/bought").json<Key[]>();
  },
  schema: keySchema,
  name: "boughtKeys",
});
