import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthed } from "@/features/auth/hooks/use-authed";

export const useProtectedRedirect = (redirectPath: string = "/") => {
  const router = useRouter();
  const authed = useAuthed();

  useLayoutEffect(() => {
    if (authed.status === "resolved" && !authed.user) {
      router.push(redirectPath);
    }
  }, [authed.user, authed.status]);
};
