import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { createSignedUploadUrlMutation } from "@/features/common/mutations/use-create-signed-upload-url";
import { uploadImage } from "@/features/common/mutations/use-upload-image";
import { opportunitiesCollection } from "@/features/monetise/collections/opportunities";

export interface UpdateOpportunityData extends Omit<
  UpdateOpportunityParams,
  "brandLogo" | "mediaAssets"
> {
  brandLogo?: File | string;
  mediaAssets?: (File | string)[];
}

export interface UpdateOpportunityMutationParams {
  opportunityId: string;
  data: UpdateOpportunityData;
}

const updateOpportunityMutation = createMutation<
  UpdateOpportunityMutationParams,
  Opportunity
>({
  write: async (params) => {
    let brandLogoUrl: string | undefined = undefined;
    let mediaAssetsUrls: string[] | undefined = undefined;

    // Handle brandLogo upload if it's a File
    if (params.data.brandLogo instanceof File) {
      const { uploadUrl, fileType } = await createSignedUploadUrlMutation.write(
        {
          fileName: params.data.brandLogo.name,
          fileType: params.data.brandLogo.type,
        },
      );

      brandLogoUrl = await uploadImage.write({
        file: params.data.brandLogo,
        type: fileType,
        uploadUrl: uploadUrl,
      });
    } else if (typeof params.data.brandLogo === "string") {
      brandLogoUrl = params.data.brandLogo;
    }

    // Handle mediaAssets uploads
    if (params.data.mediaAssets && params.data.mediaAssets.length > 0) {
      mediaAssetsUrls = await Promise.all(
        params.data.mediaAssets.map(async (asset) => {
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
    } else if (params.data.mediaAssets !== undefined) {
      // If mediaAssets is explicitly set to empty array, pass it
      mediaAssetsUrls = [];
    }

    return api
      .put(`admin/opportunities/${params.opportunityId}`, {
        json: {
          ...params.data,
          brandLogo: brandLogoUrl,
          mediaAssets: mediaAssetsUrls,
        },
      })
      .json<Opportunity>();
  },
});

export const useUpdateOpportunity = () => {
  return useOptimisticMutation<UpdateOpportunityMutationParams, Opportunity>({
    mutation: updateOpportunityMutation,
    onOptimistic: (ch, params) => {
      return ch(opportunitiesCollection).update(
        params.opportunityId,
        (item) => {
          Object.assign(item, params.data);
          if (params.data.brandLogo instanceof File) {
            item.brandLogo = URL.createObjectURL(params.data.brandLogo);
          }
          if (params.data.mediaAssets) {
            item.mediaAssets = params.data.mediaAssets.map((asset) =>
              asset instanceof File ? URL.createObjectURL(asset) : asset,
            );
          }
          item.updatedAt = new Date().toISOString();
        },
      );
    },
  });
};
