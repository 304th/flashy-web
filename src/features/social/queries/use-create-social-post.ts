import ky from "ky";
import { api } from "@/services/api";
import { useOptimisticMutation } from "@/lib/query.v3";
import { createMutation } from "@/lib/mutation";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";

export interface CreateSocialPostParams {
  description?: string;
  poll: string[];
  images: File[];
}

export interface GetSignedUrlForUploadParams {
  fileName: string;
  fileType: string;
}

const createSignedUploadUrl = createMutation<
  GetSignedUrlForUploadParams,
  { fileName: string; fileType: string; uploadUrl: string }
>({
  writeToSource: async (params) => {
    return await api
      .post("generate-signed-upload-params", {
        json: {
          fileName: params.fileName,
          fileType: params.fileType,
        },
      })
      .json();
  },
});

const createSocialPostMutation = createMutation<
  CreateSocialPostParams,
  SocialPost
>({
  writeToSource: async (params) => {
    let uploadedImages: string[] = [];

    if (params.images.length > 0) {
      uploadedImages = await Promise.all(
        params.images.map(async (image) => {
          const { uploadUrl, fileType } = await createSignedUploadUrl.writeData(
            {
              fileName: image.name,
              fileType: image.type,
            },
          );

          await ky.put(uploadUrl, {
            body: image,
            headers: {
              "Content-Type": fileType,
              "Cache-Control": "max-age=31536000",
            },
          });

          return uploadUrl.replace(/\?.*$/, "");
        }),
      );
    }

    return api
      .post("social/create", {
        json: {
          description: params.description,
          images: uploadedImages,
          poll: params.poll.map((item: any, index: number) => ({
            id: index + 1,
            text: item,
            votes: [],
          })),
        },
      })
      .json<SocialPost>();
  },
});

export const useCreateSocialPost = () => {
  const { optimisticUpdates: socialFeed } = useSocialPosts();

  return useOptimisticMutation<CreateSocialPostParams, SocialPost>({
    mutation: createSocialPostMutation,
    optimisticUpdates: [
      async (params) => {
        return await socialFeed.prepend(
          {
            ...params,
            images: params.images?.map((image) => URL.createObjectURL(image)),
            poll: {
              pollVotedId: null,
              results: params.poll.map((item, index) => ({
                id: index + 1,
                text: item,
                votes: 0,
              })),
            },
          },
          {
            sync: true,
          },
        );
      },
    ],
  });
};
