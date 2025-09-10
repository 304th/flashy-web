import ky from "ky";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getMutation, handleOptimisticUpdateError } from "@/lib/query";
import { useGetSignedUrlForUpload } from "@/features/auth/queries/use-get-signed-url-for-upload";

export interface CreateSocialPostParams {
  description?: string;
  poll: string[];
  images: File[];
}

export const useCreateSocialPost = (options?: {
  onMutate?: (variables: CreateSocialPostParams) => unknown;
  onSuccess?: (newPost: SocialPost) => void;
}) => {
  const queryClient = useQueryClient();
  const getSignedUrl = useGetSignedUrlForUpload();

  return getMutation<SocialPost, Error, CreateSocialPostParams>(
    ["createSocialPost"],
    async (params: CreateSocialPostParams) => {
      let uploadedImages: string[] = [];

      if (params.images.length > 0) {
        uploadedImages = await Promise.all(
          params.images.map(async (image) => {
            const { uploadUrl, fileType } = await getSignedUrl.mutateAsync({
              fileName: image.name,
              fileType: image.type,
            });

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
    {
      onError: handleOptimisticUpdateError(queryClient),
      onMutate: options?.onMutate,
      onSuccess: options?.onSuccess,
    },
  );
};
