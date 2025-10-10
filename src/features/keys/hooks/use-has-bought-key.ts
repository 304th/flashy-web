import { useMemo } from "react";
import { useBoughtKeys } from "@/features/keys/queries/use-bought-keys";

export const useHasBoughtKey = (channelId?: string) => {
  const { data: boughtKeys } = useBoughtKeys();

  return useMemo(() => {
    if (!boughtKeys || !channelId) return false;

    return boughtKeys.includes(channelId);
  }, [boughtKeys, channelId]);
};
