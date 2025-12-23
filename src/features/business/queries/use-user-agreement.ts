import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

interface UserAgreementResponse {
  hasAgreement: boolean;
  agreement: {
    _id: string;
    status: string;
    opportunityId: string;
  } | null;
}

export const useUserAgreement = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["business", "user-agreement", userId],
    queryFn: async () => {
      return api.get(`users/${userId}/agreement`).json<UserAgreementResponse>();
    },
    enabled: !!userId,
  });
};
