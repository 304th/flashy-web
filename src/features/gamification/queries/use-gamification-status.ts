import { useLiveEntity } from "@/lib/query-toolkit-v2";
import { gamificationStatusEntity } from "../entities/gamification-status.entity";
import { useAuthed } from "@/features/auth/hooks/use-authed";
import type { GamificationStatus } from "../types";

export const useGamificationStatus = () => {
  const authed = useAuthed();

  return useLiveEntity<GamificationStatus>({
    entity: gamificationStatusEntity,
    queryKey: ["gamification", "status"],
    options: {
      enabled: Boolean(authed.user?.uid),
    },
  });
};
