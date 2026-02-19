import { api } from "@/services/api";
import { signOut } from "@/services/firebase";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async () => {
      return api.delete("user/delete-account").json<{ ok: boolean }>();
    },
    onSuccess: () => {
      // Sign out and redirect immediately — don't await signOut
      // so the user is navigated away without delay
      signOut().catch(() => {});
      window.location.href = "/";
    },
    onError: () => {
      toast.error("Failed to delete account. Please try again later.");
    },
  });
};
