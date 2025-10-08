import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleMutationError } from "@/lib/query-toolkit-v2";
import { signOut } from "@/services/firebase";

export const useLogout = () => {
  const queryClient = useQueryClient();
  //FIXME: using standard useMutation because getMutation only supports ApiResponse
  return useMutation<undefined>({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await signOut();
    },
    onError: handleMutationError,
    onSuccess: () => {
      void queryClient.resetQueries({ queryKey: ["me"] });
    },
  });
};
