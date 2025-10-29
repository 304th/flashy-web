import ky from 'ky';
import { getQuery } from "@/lib/query-toolkit-v2";

export const useUploadedVideoConfig = (videoId: string) => {
  return getQuery(['uploadedVideoConfig', videoId], async () => {
    return ky(`https://vod.api.video/vod/${videoId}/player.json`).json<{ video: { mp4: string; poster: string; src: string; } }>()
  }, Boolean(videoId))
}