import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { businessAccountsCollection } from "@/features/business/collections/business-accounts";

const approveBusinessAccountMutation = createMutation<
  string,
  BusinessAccountActionResponse
>({
  write: async (id) => {
    return api
      .post(`admin/business-accounts/${id}/approve`)
      .json<BusinessAccountActionResponse>();
  },
});

export const useApproveBusinessAccount = () => {
  return useOptimisticMutation<string, BusinessAccountActionResponse>({
    mutation: approveBusinessAccountMutation,
    onOptimistic: (ch, id) => {
      return ch(businessAccountsCollection).update(id, (item) => ({
        ...item,
        status: "approved",
        approvedAt: new Date().toISOString(),
        rejectionReason: undefined,
        rejectedAt: undefined,
      }));
    },
  });
};
