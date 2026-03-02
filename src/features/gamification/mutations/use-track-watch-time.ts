import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";

export const useTrackWatchTime = () => {
  return useMutation({
    mutationFn: async (params: { minutes: number }) => {
      return await api
        .post("gamification/watch-time", { json: params })
        .json();
    },
  });
};
