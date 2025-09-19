import { api } from "@/services/api";
import { useLiveEntity } from "@/lib/query-toolkit/use-live-entity";
import { createEntity } from "@/lib/query-toolkit/entity";
import { decodePollResults } from "@/features/social/utils/poll";

const socialPostEntity = createEntity<SocialPost, { id: string }>({
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
