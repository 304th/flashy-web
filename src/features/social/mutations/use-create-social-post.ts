import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { createSignedUploadUrlMutation } from "@/features/common/mutations/use-create-signed-upload-url";
import { uploadImage } from "@/features/common/mutations/use-upload-image";
import { socialFeedCollection } from "@/features/social/collections/social-feed";
import { useMe } from "@/features/auth/queries/use-me";

export interface CreateSocialPostParams {
  description?: string;
  poll: string[];
  images: File[];
  behindKey: boolean;
  mentionedUsers: Partial<User>[];
}

const createSocialPostMutation = createMutation<
  CreateSocialPostParams,
  SocialPost
>({
  write: async (params) => {
    let uploadedImages: string[] = [];

    if (params.images.length > 0) {
      uploadedImages = await Promise.all(
        params.images.map(async (image) => {
          const { uploadUrl, fileType } =
            await createSignedUploadUrlMutation.write({
              fileName: image.name,
              fileType: image.type,
            });

          return await uploadImage.write({
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
          mentionedUsers: JSON.stringify(params.mentionedUsers),
        },
      })
      .json<SocialPost>();
  },
});

export const useCreateSocialPost = () => {
  const { data: author } = useMe();

  return useOptimisticMutation<CreateSocialPostParams, SocialPost>({
    mutation: createSocialPostMutation,
    onOptimistic: (ch, params) => {
      return ch(socialFeedCollection).prepend(
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
          userId: author!.fbId,
          username: author!.username,
          userimage: author!.userimage,
        },
        {
          sync: true,
          syncFn: (socialPost) => {
            return {
              ...socialPost,
              images: params.images?.map((image) => URL.createObjectURL(image)),
              reactions: {},
              poll: {
                pollVotedId: null,
                results: socialPost.poll as any,
              },
            };
          },
        },
      );
    },
  });
};
