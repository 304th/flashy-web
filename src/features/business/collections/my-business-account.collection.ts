import { api } from "@/services/api";
import { createCollection } from "@/lib/query-toolkit-v2/collection";
import { businessAccountSchema } from "@/features/business/schemas/business-account.schema";

export const myBusinessAccountCollection = createCollection<BusinessAccount>({
  async sourceFrom() {
    const response = await api
      .get("business-account/me")
      .json<BusinessAccount>();

    return [response];
  },
  schema: businessAccountSchema,
  name: "my-business-account",
});
