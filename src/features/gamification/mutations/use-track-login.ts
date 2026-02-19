import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

interface TrackLoginResponse {
  alreadyLoggedInToday: boolean;
  dailyStreak: number;
  unclaimedStreakXp: number;
  streakXpForToday: number;
  milestoneUnlocked?: string | null;
}

export const useTrackLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await api
        .post("gamification/login")
        .json<TrackLoginResponse>();
    },
    onSuccess: (data) => {
      if (!data.alreadyLoggedInToday) {
        queryClient.invalidateQueries({ queryKey: ["gamification"] });
      }
    },
  });
};
