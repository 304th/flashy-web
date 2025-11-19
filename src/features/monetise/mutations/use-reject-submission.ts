import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { sponsorSubmissionsCollection } from "@/features/monetise/collections/sponsor-submissions";

export interface RejectSubmissionParams {
  creatorOpportunityId: string;
  feedback: string;
}

const rejectSubmissionMutation = createMutation<
  RejectSubmissionParams,
  ApproveRejectResponse
>({
  write: async (params) => {
    return api
      .post(`sponsor/submissions/${params.creatorOpportunityId}/reject`, {
        json: { feedback: params.feedback },
      })
      .json<ApproveRejectResponse>();
  },
});

export const useRejectSubmission = () => {
  return useOptimisticMutation<RejectSubmissionParams, ApproveRejectResponse>({
    mutation: rejectSubmissionMutation,
    onOptimistic: (ch, params) => {
      return ch(sponsorSubmissionsCollection).update(
        params.creatorOpportunityId,
        (item) => {
          item.status = "rejected" as CreatorOpportunityStatus;
          item.feedback = params.feedback;
        }
      );
    },
  });
};
