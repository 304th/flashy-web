import { api } from "@/services/api";
import {useLiveEntity} from "@/lib/query-toolkit/use-live-entity";
import {createEntity} from "@/lib/query-toolkit/entity";
import {socialPostSchema} from "@/features/social/schemas/social-post.schema";

const socialPostEntity = createEntity<SocialPost, { id: string }>({
  sourceFrom: async (params) => {
    return await api.get(`social-post-item/${params?.id!}`).json<SocialPost>();
  },
  schema: socialPostSchema,
})

export const useSocialPostById = (id: string) => {
  return useLiveEntity<SocialPost, { id: string }>({
    entity: socialPostEntity,
    queryKey: ["social", id],
    getParams: () => ({ id }),
    options: {
      enabled: Boolean(id),
    }
  })
}
