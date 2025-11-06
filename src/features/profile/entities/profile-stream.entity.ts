import {createEntity} from "@/lib/query-toolkit-v2";
import {api} from "@/services/api";

export const profileStreamEntity = createEntity<Stream>({
  sourceFrom: async () => {
    return await api.get("streaming/me").json();
  },
  name: "profile-stream",
});