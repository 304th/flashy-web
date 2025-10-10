import { useLiveQuery } from "@/lib/query-toolkit-v2";
import { useAuthed } from "@/features/auth/hooks/use-authed";
import { boughtKeysDetailsEntity } from "@/features/keys/entities/bought-keys-details.entity";

export const useBoughtKeysDetails = () => {
  const authed = useAuthed();

  return useLiveQuery({
    queryKey: ["me", authed.user?.uid, "keys", "bought", "details"],
    collection: boughtKeysDetailsEntity,
    options: {
      enabled: Boolean(authed.user?.uid),
    },
  });
};
