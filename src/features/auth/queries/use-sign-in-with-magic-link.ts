import { useQueryClient } from "@tanstack/react-query";
import {
  getMutation,
  handleAuthSuccess,
  handleMutationError,
} from "@/lib/query-toolkit-v2";
import { signInWithLMagicLink } from "@/services/firebase";
import { api } from "@/services/api";

export interface SignInWithMagicLinkParams {
  email: string;
  link: string;
}

export const useSignInWithMagicLink = () => {
  const queryClient = useQueryClient();

  return getMutation(
    ["signInWithMagicLink"],
    async (params: SignInWithMagicLinkParams) => {
      const tokenId = await signInWithLMagicLink(params.email, params.link);

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
