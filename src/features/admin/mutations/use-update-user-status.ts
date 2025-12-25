import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";

export interface UpdateUserStatusParams {
  fbId: string;
  verified?: boolean;
  moderator?: boolean;
  manager?: boolean;
  representative?: boolean;
  isAssociate?: boolean;
}

const updateUserStatusMutation = createMutation<UpdateUserStatusParams, void>({
  write: async ({ fbId, ...body }) => {
    return api.post(`user/changeStatus/${fbId}`, { json: body }).json<void>();
  },
});

export const useUpdateUserStatus = () => {
  return useOptimisticMutation<UpdateUserStatusParams, void>({
    mutation: updateUserStatusMutation,
  });
};
