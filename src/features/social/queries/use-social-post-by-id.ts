import { api } from "@/services/api";
import { useLiveEntity } from "@/lib/query-toolkit/use-live-entity";
import { useLiveEntity as useLiveEntityV2, createEntity as createEntityV2 } from "@/lib/query-toolkit-v2";
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

export const socialPostEntityV2 = createEntityV2<SocialPost, { id: string }>({
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
  name: 'social-post'
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

export const useSocialPostByIdV2 = (id: string) => {
  return useLiveEntityV2<SocialPost, { id: string }>({
    entity: socialPostEntityV2,
    queryKey: ["social", id],
    getParams: () => ({ id }),
    options: {
      enabled: Boolean(id),
    },
  });
};
