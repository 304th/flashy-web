import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getMutation, handleMutationError } from "@/lib/query";
import { token } from "@/services/token";
import { transformLegacyMe } from "@/features/auth/queries/useMe";

interface LoginWithEmailParams {
  email: string;
  password: string;
}

export const useLoginWithEmail = () => {
  const queryClient = useQueryClient();

  return getMutation<LegacyMe, Error, LoginWithEmailParams>(
    ["loginWithEmail"],
    async ({ email, password }: LoginWithEmailParams) => {
      return await api
        .post("login", {
          body: JSON.stringify({ email, password }),
        })
        .json<any>();
    },
    {
      onError: handleMutationError,
      onSuccess: (user) => {
        if (user.token.accessToken) {
          token.setAccessToken(user?.token?.accessToken);
        }

        if (user.token.refreshToken) {
          token.setRefreshToken(user?.token?.refreshToken);
        }

        void queryClient.setQueryData(['me'], () => transformLegacyMe(user));
        void queryClient.invalidateQueries({ queryKey: ['me'] });
      },
    }
  );
};
