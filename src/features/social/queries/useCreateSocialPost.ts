import { api } from "@/services/api";
import { getMutation } from "@/lib/query";

interface CreateSocialPostParams {
  description: string;
}

export const useCreateSocialPost = () => getMutation(['createSocialPost'], async ({ description }: CreateSocialPostParams) => {
  const formData = new FormData();

  formData.append("description", description);

  await api.post('create-social-post', {
    body: formData,
  })
})