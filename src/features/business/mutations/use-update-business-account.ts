import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { myBusinessAccountCollection } from "@/features/business/collections/my-business-account.collection";

const updateBusinessAccountMutation = createMutation<
  UpdateBusinessAccountParams,
  BusinessAccount
>({
  write: async (params) => {
    return api
      .put("business-account", {
        json: params,
      })
      .json<BusinessAccount>();
  },
});

export const useUpdateBusinessAccount = () => {
  return useOptimisticMutation<UpdateBusinessAccountParams, BusinessAccount>({
    mutation: updateBusinessAccountMutation,
    onOptimistic: (ch, params) => {
      return ch(myBusinessAccountCollection).update((item) => ({
        ...item,
        ...params,
        status: "pending", // Reset to pending on update
        updatedAt: new Date().toISOString(),
      }));
    },
  });
};
