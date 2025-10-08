import { createEntity, useLiveEntity } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

const keyPriceEntity = createEntity<KeyPrice, { userId: string }>({
  sourceFrom: async (params) => {
    return await api.get(`keys/${params?.userId!}/price`).json();
  },
  name: 'keyPrice',
});

export const useKeyPrice = (userId: string) => {
  return useLiveEntity<KeyPrice, { userId: string }>({
    entity: keyPriceEntity,
    queryKey: ["keys", userId, "price"],
    getParams: () => ({ userId }),
    options: {
      enabled: Boolean(userId),
    },
  });
};
