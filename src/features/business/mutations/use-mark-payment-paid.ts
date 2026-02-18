import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

interface MarkPaymentPaidInput {
  creatorOpportunityId: string;
  amount?: number | null;
  currency?: PaymentCurrency;
  note?: string | null;
}

export const useMarkPaymentPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      creatorOpportunityId,
      amount,
      currency,
      note,
    }: MarkPaymentPaidInput) => {
      return api
        .post(`sponsor/payments/${creatorOpportunityId}/mark-paid`, {
          json: { amount, currency, note },
        })
        .json<MarkPaymentPaidResponse>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business", "sponsor-payments"],
      });
    },
  });
};
