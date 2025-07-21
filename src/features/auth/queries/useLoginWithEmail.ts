import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import {
  getMutation,
  handleAuthSuccess,
  handleMutationError,
} from "@/lib/query";
import { signInWithEmail } from "@/services/firebase";

interface LoginWithEmailParams {
  email: string;
  password: string;
}

export const useLoginWithEmail = () => {
  const queryClient = useQueryClient();

  return getMutation<User, Error, LoginWithEmailParams>(
    ["loginWithEmail"],
    async ({ email, password }: LoginWithEmailParams) => {
      const tokenId = await signInWithEmail(email, password);

      if (!tokenId) {
        throw new Error("Error signing in");
      }

      return await api
        .post("auth/login", {
          body: JSON.stringify({ tokenId }),
        })
        .json<any>();
    },
    {
      onError: handleMutationError,
      onSuccess: handleAuthSuccess(queryClient),
    },
  );
};
