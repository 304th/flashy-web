import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { myOpportunitiesCollection } from "@/features/monetise/collections/my-opportunities";
import { createSignedUploadUrlMutation } from "@/features/common/mutations/use-create-signed-upload-url";
import { uploadImage } from "@/features/common/mutations/use-upload-image";

export interface SubmitDeliverablesParams {
  opportunityId: string;
  files: File[];
  links: string[];
  note?: string;
}

const submitDeliverablesMutation = createMutation<
  SubmitDeliverablesParams,
  SubmitDeliverablesResponse
>({
  write: async (params) => {
    let fileUrls: string[] = [];

    if (params.files && params.files.length > 0) {
      fileUrls = await Promise.all(
        params.files.map(async (asset) => {
          if (asset instanceof File) {
            const { uploadUrl, fileType } =
              await createSignedUploadUrlMutation.write({
                fileName: asset.name,
                fileType: asset.type,
              });

            return await uploadImage.write({
              file: asset,
              type: fileType,
              uploadUrl: uploadUrl,
            });
          }
          return asset;
        }),
      );
    }

    return api
      .post(`opportunities/${params.opportunityId}/submit`, {
        json: {
          files: fileUrls,
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
    // onOptimistic: (ch, params) => {
    //   return ch(myOpportunitiesCollection).update(
    //     params.opportunityId,
    //     (item) => {
    //       item.status = "submitted" as CreatorOpportunityStatus;
    //       item.submittedAt = new Date().toISOString();
    //       item.submission = {
    //         files: params.files,
    //         links: params.links,
    //         note: params.note,
    //       };
    //     },
    //   );
    // },
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
    // onOptimistic: (ch, params) => {
    //   return ch(myOpportunitiesCollection).update(
    //     params.opportunityId,
    //     (item) => {
    //       item.status = "submitted" as CreatorOpportunityStatus;
    //       item.submittedAt = new Date().toISOString();
    //       item.resubmitCount = item.resubmitCount + 1;
    //       item.submission = {
    //         files: params.files,
    //         links: params.links,
    //         note: params.note,
    //       };
    //     },
    //   );
    // },
  });
};
