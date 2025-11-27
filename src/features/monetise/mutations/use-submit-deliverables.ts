import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { myOpportunitiesCollection } from "@/features/monetise/collections/my-opportunities";

export interface SubmitDeliverablesParams {
  opportunityId: string;
  files: SubmissionFile[];
  links: string[];
  note?: string;
}

const submitDeliverablesMutation = createMutation<
  SubmitDeliverablesParams,
  SubmitDeliverablesResponse
>({
  write: async (params) => {
    return api
      .post(`opportunities/${params.opportunityId}/submit`, {
        json: {
          files: params.files,
          links: params.links,
          note: params.note,
        },
      })
      .json<SubmitDeliverablesResponse>();
  },
});

export const useSubmitDeliverables = () => {
  return useOptimisticMutation<
    SubmitDeliverablesParams,
    SubmitDeliverablesResponse
  >({
    mutation: submitDeliverablesMutation,
    onOptimistic: (ch, params) => {
      return ch(myOpportunitiesCollection).update(
        params.opportunityId,
        (item) => {
          item.status = "submitted" as CreatorOpportunityStatus;
          item.submittedAt = new Date().toISOString();
          item.submission = {
            files: params.files,
            links: params.links,
            note: params.note,
          };
        },
      );
    },
  });
};

const resubmitDeliverablesMutation = createMutation<
  SubmitDeliverablesParams,
  SubmitDeliverablesResponse
>({
  write: async (params) => {
    return api
      .post(`opportunities/${params.opportunityId}/resubmit`, {
        json: {
          files: params.files,
          links: params.links,
          note: params.note,
        },
      })
      .json<SubmitDeliverablesResponse>();
  },
});

export const useResubmitDeliverables = () => {
  return useOptimisticMutation<
    SubmitDeliverablesParams,
    SubmitDeliverablesResponse
  >({
    mutation: resubmitDeliverablesMutation,
    onOptimistic: (ch, params) => {
      return ch(myOpportunitiesCollection).update(
        params.opportunityId,
        (item) => {
          item.status = "submitted" as CreatorOpportunityStatus;
          item.submittedAt = new Date().toISOString();
          item.resubmitCount = item.resubmitCount + 1;
          item.submission = {
            files: params.files,
            links: params.links,
            note: params.note,
          };
        },
      );
    },
  });
};
