import { useLiveQuery } from "@/lib/query-toolkit";
import { useAuthedUser } from "@/features/auth/hooks/use-authed-user";
import { boughtKeysCollections } from "@/features/keys/collections/bought-keys";

export const useBoughtKeys = () => {
  const currentUser = useAuthedUser();

  return useLiveQuery({
    queryKey: ["me", currentUser?.uid, "keys", "bought"],
    collection: boughtKeysCollections,
    options: {
      enabled: Boolean(currentUser),
    },
  });
};
