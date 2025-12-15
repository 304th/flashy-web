import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { createSignedUploadUrlMutation } from "@/features/common/mutations/use-create-signed-upload-url";
import { uploadImage } from "@/features/common/mutations/use-upload-image";
import { opportunitiesCollection } from "@/features/monetise/collections/opportunities";

export interface CreateOpportunityMutationParams extends Omit<
  CreateOpportunityParams,
  "brandLogo" | "mediaAssets"
> {
  brandLogo?: File | string;
  mediaAssets?: (File | string)[];
}

const createOpportunityMutation = createMutation<
  CreateOpportunityMutationParams,
  Opportunity
>({
  write: async (params) => {
    let brandLogoUrl: string | undefined = undefined;
    let mediaAssetsUrls: string[] = [];

    // Handle brandLogo upload if it's a File
    if (params.brandLogo instanceof File) {
      const { uploadUrl, fileType } = await createSignedUploadUrlMutation.write(
        {
          fileName: params.brandLogo.name,
          fileType: params.brandLogo.type,
        },
      );

      brandLogoUrl = await uploadImage.write({
        file: params.brandLogo,
        type: fileType,
        uploadUrl: uploadUrl,
      });
    } else if (typeof params.brandLogo === "string") {
      brandLogoUrl = params.brandLogo;
    }

    // Handle mediaAssets uploads
    if (params.mediaAssets && params.mediaAssets.length > 0) {
      mediaAssetsUrls = await Promise.all(
        params.mediaAssets.map(async (asset) => {
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
      .post("admin/opportunities", {
        json: {
          ...params,
          brandLogo: brandLogoUrl,
          mediaAssets: mediaAssetsUrls,
        },
      })
      .json<Opportunity>();
  },
});

export const useCreateOpportunity = () => {
  return useOptimisticMutation<CreateOpportunityMutationParams, Opportunity>({
    mutation: createOpportunityMutation,
    onOptimistic: (ch, params) => {
      return ch(opportunitiesCollection).prepend(
        {
          ...params,
          brandLogo:
            params.brandLogo instanceof File
              ? URL.createObjectURL(params.brandLogo)
              : params.brandLogo,
          mediaAssets: params.mediaAssets?.map((asset) =>
            asset instanceof File ? URL.createObjectURL(asset) : asset,
          ),
          status: params.status || "active",
          compensationType: params.compensationType || "fixed",
          eligibility: {
            niches: params.eligibility?.niches || [],
            platforms: params.eligibility?.platforms || [],
            countries: params.eligibility?.countries || [],
          },
          maxParticipants: params.maxParticipants || 0,
          currentParticipants: 0,
        },
        {
          sync: true,
        },
      );
    },
  });
};
