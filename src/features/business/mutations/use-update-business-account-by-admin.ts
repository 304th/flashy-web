import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { businessAccountsCollection } from "@/features/business/collections/business-accounts";

interface UpdateBusinessAccountByAdminParams {
  id: string;
  data: UpdateBusinessAccountParams;
}

const updateBusinessAccountByAdminMutation = createMutation<
  UpdateBusinessAccountByAdminParams,
  BusinessAccount
>({
  write: async ({ id, data }) => {
    return api
      .put(`admin/business-accounts/${id}`, {
        json: data,
      })
      .json<BusinessAccount>();
  },
});

export const useUpdateBusinessAccountByAdmin = () => {
  return useOptimisticMutation<
    UpdateBusinessAccountByAdminParams,
    BusinessAccount
  >({
    mutation: updateBusinessAccountByAdminMutation,
    // onOptimistic: (ch, { id, data }) => {
    //   return ch(businessAccountsCollection).update(
    //     (item) => item._id === id,
    //     (item) => ({
    //       ...item,
    //       ...data,
    //       updatedAt: new Date().toISOString(),
    //     }),
    //   );
    // },
  });
};
