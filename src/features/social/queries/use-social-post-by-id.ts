import { api } from "@/services/api";
import { createEntity, useLiveEntity } from "@/lib/query-toolkit-v2";
import { decodePollResults } from "@/features/social/utils/poll";

export const socialPostEntity = createEntity<SocialPost, { id: string }>({
  sourceFrom: async (params) => {
    const socialPost = await api
      .get(`social-post-item/${params?.id!}`)
      .json<SocialPost>();

    return {
      ...socialPost,
      poll: {
        ...socialPost.poll,
        results: decodePollResults(socialPost.poll),
      },
    };
  },
  name: "socialPost",
});

export const useSocialPostById = (id: string) => {
  return useLiveEntity<SocialPost, { id: string }>({
    entity: socialPostEntity,
    queryKey: ["social", id],
    getParams: () => ({ id }),
    options: {
      enabled: Boolean(id),
    },
  });
};
