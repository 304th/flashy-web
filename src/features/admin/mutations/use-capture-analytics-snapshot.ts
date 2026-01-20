import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { useQueryClient } from "@tanstack/react-query";
import { AnalyticsSnapshot } from "../queries/use-admin-analytics-history";

const captureAnalyticsSnapshotMutation = createMutation<void, AnalyticsSnapshot>({
  write: async () => {
    return api.post("admin/analytics/snapshot").json<AnalyticsSnapshot>();
  },
});

export const useCaptureAnalyticsSnapshot = () => {
  const queryClient = useQueryClient();

  return useOptimisticMutation<void, AnalyticsSnapshot>({
    mutation: captureAnalyticsSnapshotMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "analytics", "history"],
      });
    },
  });
};
