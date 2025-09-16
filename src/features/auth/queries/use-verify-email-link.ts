import { getQuery } from "@/lib/query-toolkit";
import { isSignInWithLink } from "@/services/firebase";
import { useSignInWithMagicLink } from "@/features/auth/queries/use-sign-in-with-magic-link";

export const useVerifyEmailLink = (onSuccess: () => void) => {
  const signInWithMagicLink = useSignInWithMagicLink();

  return getQuery(["verifyEmailLink"], async () => {
    if (await isSignInWithLink()) {
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get("email");

      if (!email) {
        return;
      }

      await signInWithMagicLink.mutateAsync(
        {
          email,
          link: window.location.href,
        },
        {
          onSuccess,
        },
      );
    }
  });
};
