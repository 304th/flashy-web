import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { useQueryClient } from "@tanstack/react-query";

const deleteHomeBannerMutation = createMutation<string, { success: boolean }>({
  write: async (id) => {
    return api.delete(`home-banners/${id}`).json<{ success: boolean }>();
  },
});

export const useDeleteHomeBanner = () => {
  const queryClient = useQueryClient();

  return useOptimisticMutation<string, { success: boolean }>({
    mutation: deleteHomeBannerMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "home-banners"] });
    },
  });
};
