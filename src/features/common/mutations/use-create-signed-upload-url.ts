import {
  createMutation,
  OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit";
import { api } from "@/services/api";

export interface CreateSignedUrlForUploadParams {
  fileName: string;
  fileType: string;
}

export const createSignedUploadUrlMutation = createMutation<
  CreateSignedUrlForUploadParams,
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

export const useCreateSignedUploadUrl = ({
  optimisticUpdates,
}: {
  optimisticUpdates?: OptimisticUpdate<CreateSignedUrlForUploadParams>[];
} = {}) => {
  return useOptimisticMutation({
    mutation: createSignedUploadUrlMutation,
    optimisticUpdates,
  });
};
