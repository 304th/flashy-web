import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import {
  getMutation,
  handleAuthSuccess,
  handleMutationError,
} from "@/lib/query-toolkit-v2";
import { signInWithEmail } from "@/services/firebase";

interface LoginWithEmailParams {
  email: string;
  password: string;
}

export const useSignInWithEmail = () => {
  const queryClient = useQueryClient();

  return getMutation<User, Error, LoginWithEmailParams>(
    ["signInWithEmail"],
    async ({ email, password }: LoginWithEmailParams) => {
      const tokenId = await signInWithEmail(email, password);

      if (!tokenId) {
        throw new Error("Error signing in");
      }

      // TODO: fix long modal not closing after signed-in (useMe returns but this holds) maybe remove auth/token/login

      return api
        .post("auth/token/login", {
          json: { tokenId },
        })
        .json<any>();
    },
    {
      onError: handleMutationError,
      onSuccess: handleAuthSuccess(queryClient),
    },
  );
};
