import { createEntity } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import type { GamificationStatus } from "../types";

export const gamificationStatusEntity = createEntity<GamificationStatus>({
  sourceFrom: async () => {
    return await api.get("gamification/status").json();
  },
  name: "gamification-status",
});
