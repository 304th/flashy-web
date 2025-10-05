import { api } from "@/services/api";
import { useOptimisticMutation } from "@/lib/query-toolkit";
import { createMutation } from "@/lib/query-toolkit/mutation";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";
import { createSignedUploadUrlMutation } from "@/features/common/mutations/use-create-signed-upload-url";
import { uploadImage } from "@/features/common/mutations/use-upload-image";

export interface CreateSocialPostParams {
  description?: string;
  poll: string[];
  images: File[];
  behindKey: boolean;
}

const createSocialPostMutation = createMutation<
  CreateSocialPostParams,
  SocialPost
>({
  writeToSource: async (params) => {
    let uploadedImages: string[] = [];

    if (params.images.length > 0) {
      uploadedImages = await Promise.all(
        params.images.map(async (image) => {
          const { uploadUrl, fileType } =
            await createSignedUploadUrlMutation.writeData({
              fileName: image.name,
              fileType: image.type,
            });

          return await uploadImage.writeData({
            file: image,
            type: fileType,
            uploadUrl: uploadUrl,
          });
        }),
      );
    }

    return api
      .post("social/create", {
        json: {
          description: params.description,
          images: uploadedImages,
          poll: JSON.stringify(
            params.poll.map((item: any, index: number) => ({
              id: index + 1,
              text: item,
              votes: [],
            })),
          ),
          behindKey: params.behindKey,
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
            syncFn: (socialPost) => {
              return {
                ...socialPost,
                poll: {
                  pollVotedId: null,
                  results: socialPost.poll.results,
                },
              };
            },
          },
        );
      },
    ],
  });
};
