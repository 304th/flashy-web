import { toast } from "sonner";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";

export interface UnbanUserParams {
  userId: string;
}

export interface UnbanUserResponse {
  error: boolean;
  message?: string;
}

const unbanUserMutation = createMutation<UnbanUserParams, UnbanUserResponse>({
  write: async (params) => {
    return api
      .post(`user/unban/${params.userId}`)
      .json<UnbanUserResponse>();
  },
});

export const useUnbanUser = () => {
  return useOptimisticMutation({
    mutation: unbanUserMutation,
    onSuccess: (response) => {
      if (response.error) {
        toast.error(response.message || "Failed to unban user");
      } else {
        toast.success("User has been unbanned");
      }
    },
    onError: () => {
      toast.error("Failed to unban user");
    },
  });
};
