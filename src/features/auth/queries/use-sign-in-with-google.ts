import {
  getMutation,
  handleAuthSuccess,
  handleMutationError,
} from "@/lib/query-toolkit-v2";
import { useQueryClient } from "@tanstack/react-query";
import { signInWithGoogle } from "@/services/firebase";

interface GoogleSignInParams {
  credential: JwtToken;
}

export const useSignInWithGoogle = () => {
  const queryClient = useQueryClient();

  return getMutation<void, Error, GoogleSignInParams>(
    ["googleSignIn"],
    async ({ credential }) => {
      const tokenId = await signInWithGoogle(credential);

      if (!tokenId) {
        throw new Error("Error signing in");
      }
    },
    {
      onError: handleMutationError,
      onSuccess: handleAuthSuccess(queryClient),
    },
  );
};
