import { useLiveEntity } from "@/lib/query-toolkit-v2";
import {
  challengesEntity,
  dailyChallengesEntity,
} from "../entities/challenges.entity";
import { useAuthed } from "@/features/auth/hooks/use-authed";
import type { ChallengesResponse, DailyChallengesResponse } from "../types";

export const useChallenges = () => {
  // const authed = useAuthed();

  return useLiveEntity<ChallengesResponse>({
    entity: challengesEntity,
    queryKey: ["gamification", "challenges"],
    options: {
      enabled: false, // temporarily disabled
    },
  });
};

export const useDailyChallenges = () => {
  // const authed = useAuthed();

  return useLiveEntity<DailyChallengesResponse>({
    entity: dailyChallengesEntity,
    queryKey: ["gamification", "challenges", "daily"],
    options: {
      enabled: false, // temporarily disabled
    },
  });
};
