import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { businessAccountsCollection } from "@/features/business/collections/business-accounts";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  return useOptimisticMutation<
    RejectBusinessAccountParams,
    BusinessAccountActionResponse
  >({
    mutation: rejectBusinessAccountMutation,
    // onOptimistic: (ch, { id, rejectionReason }) => {
    //   return ch(businessAccountsCollection).update(id, (item) => {
    //     item.status = "rejected";
    //     item.rejectionReason = rejectionReason;
    //     item.rejectedAt = new Date().toISOString();
    //     item.approvedAt = undefined;
    //   });
    // },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["business", "accounts", "admin"],
      });
    },
  });
};
