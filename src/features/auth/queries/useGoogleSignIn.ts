import { api } from "@/services/api";
import { getMutation, handleAuthSuccess, handleMutationError } from "@/lib/query";
import { useQueryClient } from "@tanstack/react-query";

interface GoogleSignInParams {
  credential: JwtToken;
}

export const useGoogleSignIn = () => {
  const queryClient = useQueryClient();

  return getMutation<LegacyMe, Error, GoogleSignInParams>(['googleSignIn'], async ({ credential }) => {
    return await api.post('googleAuth', {
      body: JSON.stringify({
        credential: credential,
      })
    }).json<any>()
  }, {
    onError: handleMutationError,
    onSuccess: handleAuthSuccess(queryClient),
  })
}