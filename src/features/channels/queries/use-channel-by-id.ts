import { api } from "@/services/api";
import { createEntity, useLiveEntity } from "@/lib/query-toolkit-v2";

export interface ChannelEntityParams {
  id: string;
}

const channelEntity = createEntity<User, ChannelEntityParams>({
  sourceFrom: async (params) => {
    return await api.get(`users/getProfile/${params!.id}`).json();
  },
  name: "channel",
});

export const useChannelById = (id?: string) => {
  return useLiveEntity<User, ChannelEntityParams>({
    queryKey: ["channels", id],
    entity: channelEntity,
    getParams: () => ({ id: id! }),
    options: {
      enabled: Boolean(id),
    },
  });
};
