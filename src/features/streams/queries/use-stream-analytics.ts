import { api } from "@/services/api";
import { getQuery } from "@/lib/query-toolkit-v2";

export interface StreamAnalytics {
  viewerCount: number;
  totalViews: number;
  averageWatchTime: number;
  peakViewers: number;
  chatMessagesCount: number;
}

export const useStreamAnalytics = (streamId: string) => {
  return getQuery<StreamAnalytics>(
    ["streams", streamId, "analytics"],
    async () => {
      return api.get(`streaming/${streamId}/analytics`).json<StreamAnalytics>();
    },
  );
};
