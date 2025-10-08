import ky from "ky";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";

export interface UploadImageParams {
  file: File;
  type: string;
  uploadUrl: string;
}

export const uploadImage = createMutation<UploadImageParams, string>({
  write: async (params) => {
    await ky.put(params.uploadUrl, {
      body: params.file,
      headers: {
        "Content-Type": params.type,
        "Cache-Control": "max-age=31536000",
      },
    });

    return params.uploadUrl.replace(/\?.*$/, "");
  },
});

export const useUploadImage = () => {
  return useOptimisticMutation({
    mutation: uploadImage,
  });
};
