import { createEntity } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import type { ChallengesResponse, DailyChallengesResponse } from "../types";

export const challengesEntity = createEntity<ChallengesResponse>({
  sourceFrom: async () => {
    return await api.get("gamification/challenges").json();
  },
  name: "challenges",
});

export const dailyChallengesEntity = createEntity<DailyChallengesResponse>({
  sourceFrom: async () => {
    return await api.get("gamification/challenges/daily").json();
  },
  name: "daily-challenges",
});
