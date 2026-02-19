import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

interface ClaimChallengeParams {
  challengeId: string;
}

interface ClaimChallengeResponse {
  success: boolean;
  xpAwarded: number;
  newTotalXp: number;
  newLevel: number;
  newRank: string;
  leveledUp: boolean;
}

export const useClaimChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ challengeId }: ClaimChallengeParams) => {
      return await api
        .post(`gamification/challenges/${challengeId}/claim`)
        .json<ClaimChallengeResponse>();
    },
    onSuccess: () => {
      // Invalidate all gamification queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
};
