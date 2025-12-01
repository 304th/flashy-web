import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { businessAccountsCollection } from "@/features/business/collections/business-accounts";

interface RejectBusinessAccountParams {
  id: string;
  rejectionReason: string;
}

const rejectBusinessAccountMutation = createMutation<
  RejectBusinessAccountParams,
  BusinessAccountActionResponse
>({
  write: async ({ id, rejectionReason }) => {
    return api
      .post(`admin/business-accounts/${id}/reject`, {
        json: { rejectionReason },
      })
      .json<BusinessAccountActionResponse>();
  },
});

export const useRejectBusinessAccount = () => {
  return useOptimisticMutation<
    RejectBusinessAccountParams,
    BusinessAccountActionResponse
  >({
    mutation: rejectBusinessAccountMutation,
    onOptimistic: (ch, { id, rejectionReason }) => {
      return ch(businessAccountsCollection).update(
        (item) => item._id === id,
        (item) => ({
          ...item,
          status: "rejected",
          rejectionReason,
          rejectedAt: new Date().toISOString(),
          approvedAt: undefined,
        }),
      );
    },
  });
};
