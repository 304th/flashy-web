import { createEntity } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export const blazeBalanceEntity = createEntity<BlazeBalance>(
  {
    async sourceFrom() {
      const data = await api
        .get("users/blaze")
        .json<{ blaze: string; blazeAllowance: string; }>();

      return {
        blaze: data.blaze,
        allowance: data.blazeAllowance,
      }
    },
    name: "blazeBalance",
  },
);
