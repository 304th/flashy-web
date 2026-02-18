import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

interface UseSponsorPaymentsParams {
  paymentStatus?: PaymentStatus;
}

export const useSponsorPayments = (
  params: UseSponsorPaymentsParams = {},
) => {
  return useQuery({
    queryKey: ["business", "sponsor-payments", params.paymentStatus],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set("limit", "100");

      if (params.paymentStatus) {
        searchParams.set("paymentStatus", params.paymentStatus);
      }

      return api
        .get(`sponsor/payments?${searchParams.toString()}`)
        .json<SponsorPaymentsResponse>();
    },
  });
};
