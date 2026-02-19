import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";

interface GetPresignedUrlParams {
  opportunityId: string;
  filename: string;
  contentType: string;
}

interface GetPresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}

export const useGetPresignedUrl = () => {
  return useMutation({
    mutationFn: async ({
      opportunityId,
      filename,
      contentType,
    }: GetPresignedUrlParams) => {
      return api
        .post(`opportunities/${opportunityId}/presigned-urls`, {
          json: { filename, contentType },
        })
        .json<GetPresignedUrlResponse>();
    },
  });
};

// Keep old export for backwards compatibility
export const useGetPresignedUrls = useGetPresignedUrl;

// Helper function to upload file to presigned URL
export const uploadToPresignedUrl = async (
  uploadUrl: string,
  file: File,
  contentType: string,
): Promise<void> => {
  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": contentType,
    },
  });
};
