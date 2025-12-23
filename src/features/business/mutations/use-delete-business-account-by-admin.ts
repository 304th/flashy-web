import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { businessAccountsCollection } from "@/features/business/collections/business-accounts";

const deleteBusinessAccountByAdminMutation = createMutation<
  string,
  BusinessAccountActionResponse
>({
  write: async (id) => {
    return api
      .delete(`admin/business-accounts/${id}`)
      .json<BusinessAccountActionResponse>();
  },
});

export const useDeleteBusinessAccountByAdmin = () => {
  return useOptimisticMutation<string, BusinessAccountActionResponse>({
    mutation: deleteBusinessAccountByAdminMutation,
    onOptimistic: (ch, id) => {
      return ch(businessAccountsCollection).delete(id);
    },
  });
};
