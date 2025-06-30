import { useQueryClient } from "@tanstack/react-query";
import { getMutation, handleMutationError } from "@/lib/query";
import { token } from "@/services/token";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return getMutation<unknown, Error, unknown>(
    ["logout"],
    async () => {
      token.removeAccessToken();
      token.removeRefreshToken();
    },
    {
      onError: handleMutationError,
      onSuccess: () => {
        void queryClient.resetQueries({ queryKey: ["me"] });
      },
    },
  );
};
