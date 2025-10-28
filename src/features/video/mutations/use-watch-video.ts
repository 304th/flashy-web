import { getMutation } from "@/lib/query-toolkit-v2";
import {api} from "@/services/api";

export interface WatchVideoParams {
  id: string;
}

export const useWatchVideo = () => {
  return getMutation<unknown, unknown, WatchVideoParams>(['watchVideo'], async (params) => {
    return api.put(`watchVideo/${params.id}`)
  })
};
