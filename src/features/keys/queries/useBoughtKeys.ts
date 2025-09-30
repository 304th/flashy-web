import { useLiveQuery } from "@/lib/query-toolkit";
import { useAuthed } from "@/features/auth/hooks/use-authed";
import { boughtKeysCollections } from "@/features/keys/collections/bought-keys";

export const useBoughtKeys = () => {
  const currentUser = useAuthed();

  return useLiveQuery({
    queryKey: ["me", currentUser?.uid, "keys", "bought"],
    collection: boughtKeysCollections,
    options: {
      enabled: Boolean(currentUser),
    },
  });
};
