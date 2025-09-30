import { useLiveQuery } from "@/lib/query-toolkit";
import { useAuthed } from "@/features/auth/hooks/use-authed";
import { boughtKeysCollections } from "@/features/keys/collections/bought-keys";

export const useBoughtKeys = () => {
  const authed = useAuthed();

  return useLiveQuery({
    queryKey: ["me", authed.user?.uid, "keys", "bought"],
    collection: boughtKeysCollections,
    options: {
      enabled: Boolean(authed.user?.uid),
    },
  });
};
