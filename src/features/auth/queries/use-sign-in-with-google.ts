import { api } from "@/services/api";
import {
  getMutation,
  handleAuthSuccess,
  handleMutationError,
} from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";
import { signInWithGoogle } from "@/services/firebase";

interface GoogleSignInParams {
  credential: JwtToken;
}

export const useSignInWithGoogle = () => {
  const queryClient = useQueryClient();

  return getMutation<User, Error, GoogleSignInParams>(
    ["googleSignIn"],
    async ({ credential }) => {
      const tokenId = await signInWithGoogle(credential);

      if (!tokenId) {
        throw new Error("Error signing in");
      }

      return await api
        .post("auth/login/token", {
          json: {
            tokenId,
          },
        })
        .json();
    },
    {
      onError: handleMutationError,
      onSuccess: handleAuthSuccess(queryClient),
    },
  );
};
