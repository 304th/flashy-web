import { getMutation } from "@/lib/query";
import { api } from "@/services/api";

export interface GetSignedUrlForUploadParams {
  fileName: string;
  fileType: string;
}

export const useGetSignedUrlForUpload = () =>
  getMutation<
    { fileName: string; fileType: string; uploadUrl: string },
    any,
    GetSignedUrlForUploadParams
  >(["getSignedUrlForUpload"], async (params: GetSignedUrlForUploadParams) => {
    return await api
      .post("generate-signed-upload-params", {
        json: {
          fileName: params.fileName,
          fileType: params.fileType,
        },
      })
      .json();
  });
