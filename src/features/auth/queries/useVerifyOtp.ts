import { api } from "@/services/api";
import { getMutation, handleMutationError } from "@/lib/query";
import { token } from "@/services/token";
import { transformLegacyMe } from "@/features/auth/queries/useMe";
import { useQueryClient } from "@tanstack/react-query";

interface VerifyOtpParams {
  otp: string;
  email: string;
}

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();

  return getMutation<LegacyMe, Error, VerifyOtpParams>(
    ["signupWithEmail"],
    async ({ otp, email }: VerifyOtpParams) => {
      return await api
        .post("verifyEmailAndRegister", {
          body: JSON.stringify({ otp, email }),
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

        void queryClient.setQueryData(["me"], () => transformLegacyMe(user));
        void queryClient.invalidateQueries({ queryKey: ["me"] });
      },
    },
  );
};
