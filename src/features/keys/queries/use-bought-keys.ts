import { useLiveEntity } from "@/lib/query-toolkit-v2";
import { useAuthed } from "@/features/auth/hooks/use-authed";
import { boughtKeysEntity } from "@/features/keys/entities/bought-keys.entity";

export const useBoughtKeys = () => {
  const authed = useAuthed();

  return useLiveEntity({
    queryKey: ["me", authed.user?.uid, "keys", "bought"],
    entity: boughtKeysEntity,
    options: {
      enabled: Boolean(authed.user?.uid),
    },
  });
};
