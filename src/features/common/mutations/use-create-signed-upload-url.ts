import {
  createMutation,
  OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export interface CreateSignedUrlForUploadParams {
  fileName: string;
  fileType: string;
}

export const createSignedUploadUrlMutation = createMutation<
  CreateSignedUrlForUploadParams,
  { fileName: string; fileType: string; uploadUrl: string }
>({
  write: async (params) => {
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

export const useCreateSignedUploadUrl = () => {
  return useOptimisticMutation({
    mutation: createSignedUploadUrlMutation,
  });
};
