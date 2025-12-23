import { api } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteBusinessAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return api
        .delete("business-account")
        .json<BusinessAccountActionResponse>();
    },
    onSuccess: () => {
      // Invalidate the my business account query
      queryClient.invalidateQueries({ queryKey: ["business", "my-account"] });
    },
  });
};
