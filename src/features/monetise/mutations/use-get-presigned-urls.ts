import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";

interface GetPresignedUrlsParams {
  opportunityId: string;
  files: PresignedUrlRequest[];
}

interface GetPresignedUrlsResponse {
  urls: PresignedUrlResponse[];
}

export const useGetPresignedUrls = () => {
  return useMutation({
    mutationFn: async ({ opportunityId, files }: GetPresignedUrlsParams) => {
      return api
        .post(`opportunities/${opportunityId}/presigned-urls`, {
          json: { files },
        })
        .json<GetPresignedUrlsResponse>();
    },
  });
};

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
