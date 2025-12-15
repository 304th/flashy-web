import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

interface TerminateAgreementResponse {
  success: boolean;
  message: string;
  opportunityId: string;
}

export const useTerminateAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: string) => {
      return api
        .delete(`sponsor/submissions/${submissionId}`)
        .json<TerminateAgreementResponse>();
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["business", "opportunity-submissions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["business", "submission"],
      });
    },
  });
};
