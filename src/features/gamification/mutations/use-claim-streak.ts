import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

interface ClaimStreakResponse {
  xpAwarded: number;
  totalXp: number;
  leveledUp: boolean;
  newLevel: number;
  newRank: string | null;
}

export const useClaimStreak = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await api
        .post("gamification/streak/claim")
        .json<ClaimStreakResponse>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
};
