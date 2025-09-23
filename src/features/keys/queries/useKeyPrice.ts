import { createEntity } from "@/lib/query-toolkit/entity";
import { useLiveEntity } from "@/lib/query-toolkit/use-live-entity";
import { api } from "@/services/api";

const keyPriceEntity = createEntity<KeyPrice, { userId: string }>({
  sourceFrom: async (params) => {
    return await api.get(`keys/${params?.userId!}/price`).json();
  },
})

export const useKeyPrice = (userId: string) => {
  return useLiveEntity<KeyPrice, { userId: string }>({
    entity: keyPriceEntity,
    queryKey: ["keys", userId, "price"],
    getParams: () => ({ userId }),
    options: {
      enabled: Boolean(userId),
    },
  })
}