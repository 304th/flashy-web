import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { AnalyticsSnapshot } from "../queries/use-admin-analytics-history";

const captureAnalyticsSnapshotMutation = createMutation<void, AnalyticsSnapshot>({
  write: async () => {
    return api.post("admin/analytics/snapshot").json<AnalyticsSnapshot>();
  },
  invalidateQueries: [["admin", "analytics", "history"]],
});

export const useCaptureAnalyticsSnapshot = () => {
  return useOptimisticMutation<void, AnalyticsSnapshot>({
    mutation: captureAnalyticsSnapshotMutation,
  });
};
