import { createSignedUploadUrlMutation } from "@/features/common/mutations/use-create-signed-upload-url";
import { uploadImage } from "@/features/common/mutations/use-upload-image";
import { useCreateVideoPost } from "@/features/video/mutations/use-create-video-post";

export const useSubmitNewVideo = (onSuccess?: (params: any) => void) => {
  const createVideoPost = useCreateVideoPost();

  return async (params: any) => {
    const { uploadUrl, fileType } = await createSignedUploadUrlMutation.write({
      fileName: params.thumbnailUpload.name,
      fileType: params.thumbnailUpload.type,
    });

    const thumbnail = await uploadImage.write({
      file: params.thumbnailUpload,
      type: fileType,
      uploadUrl: uploadUrl,
    });

    await createVideoPost.mutateAsync({
      title: params.title,
      description: params.description,
      price: 0,
      videoId: params.videoId,
      thumbnail,
      videoDuration: params.videoDuration,
      statusweb: params.status,
      publishDate: params.status === "published" ? Date.now() : undefined,
    });

    onSuccess?.(params);
  };
};
