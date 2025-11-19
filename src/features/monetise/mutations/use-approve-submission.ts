import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { sponsorSubmissionsCollection } from "@/features/monetise/collections/sponsor-submissions";

export interface ApproveSubmissionParams {
  creatorOpportunityId: string;
}

const approveSubmissionMutation = createMutation<
  ApproveSubmissionParams,
  ApproveRejectResponse
>({
  write: async (params) => {
    return api
      .post(`sponsor/submissions/${params.creatorOpportunityId}/approve`)
      .json<ApproveRejectResponse>();
  },
});

export const useApproveSubmission = () => {
  return useOptimisticMutation<ApproveSubmissionParams, ApproveRejectResponse>({
    mutation: approveSubmissionMutation,
    onOptimistic: (ch, params) => {
      return ch(sponsorSubmissionsCollection).update(
        params.creatorOpportunityId,
        (item) => {
          item.status = "approved" as CreatorOpportunityStatus;
          item.approvedAt = new Date().toISOString();
        }
      );
    },
  });
};
