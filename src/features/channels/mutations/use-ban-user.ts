import { toast } from "sonner";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";

export interface BanUserParams {
  userId: string;
  reason?: string;
}

export interface BanUserResponse {
  error: boolean;
  message?: string;
}

const banUserMutation = createMutation<BanUserParams, BanUserResponse>({
  write: async (params) => {
    return api
      .post(`user/ban/${params.userId}`, {
        json: { reason: params.reason },
      })
      .json<BanUserResponse>();
  },
});

export const useBanUser = () => {
  return useOptimisticMutation({
    mutation: banUserMutation,
    onSuccess: (response) => {
      if (response.error) {
        toast.error(response.message || "Failed to ban user");
      } else {
        toast.success("User has been banned");
      }
    },
    onError: () => {
      toast.error("Failed to ban user");
    },
  });
};
