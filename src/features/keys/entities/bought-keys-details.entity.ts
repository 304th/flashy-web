import { api } from "@/services/api";
import { createCollection } from "@/lib/query-toolkit-v2";
import { keyDetailsSchema } from "@/features/keys/schemas/key-details.schema";

export const boughtKeysDetailsEntity = createCollection<KeyDetails>({
  async sourceFrom() {
    return api.get("keys/usersWhoBought").json<KeyDetails[]>();
  },
  name: "boughtKeys",
  schema: keyDetailsSchema,
});
