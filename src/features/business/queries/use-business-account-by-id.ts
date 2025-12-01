import { api } from "@/services/api";
import { createEntity, useLiveEntity } from "@/lib/query-toolkit-v2";

export const businessAccountEntity = createEntity<
  BusinessAccountWithUser,
  { id: string }
>({
  sourceFrom: async (params) => {
    return api
      .get(`admin/business-accounts/${params?.id!}`)
      .json<BusinessAccountWithUser>();
  },
  name: "businessAccount",
});

export const useBusinessAccountById = (id: string | undefined) => {
  return useLiveEntity<BusinessAccountWithUser, { id: string }>({
    entity: businessAccountEntity,
    queryKey: ["business", "account", id],
    getParams: () => ({ id: id! }),
    options: {
      enabled: Boolean(id),
    },
  });
};
