import { api } from "@/services/api";
import {
  getMutation,
  handleMutationError,
  handleAuthSuccess,
} from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";

interface VerifyOtpParams {
  otp: string;
  email: string;
}

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();

  return getMutation<User, Error, VerifyOtpParams>(
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
      onSuccess: handleAuthSuccess(queryClient),
    },
  );
};
