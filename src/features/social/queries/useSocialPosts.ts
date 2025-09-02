import { api } from "@/services/api";
import { getInfiniteQuery } from "@/lib/query";

export const useSocialPosts = () => {
  return getInfiniteQuery<SocialPost[]>(['social'], async () => {
    return await api.get('relevant-social-posts').json()
  })
}