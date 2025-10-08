import { keepPreviousData } from "@tanstack/query-core";
import { getQuery } from "@/lib/query-toolkit-v2";
import { getLinksPreview } from "@/features/social/utils/getLinksPreview";

export const useLinksPreview = (links?: string[]) =>
  getQuery<LinkPreview[]>(
    ["link-preview", links],
    async () => getLinksPreview(links!),
    Boolean(links?.length),
    {
      placeholderData: keepPreviousData,
    },
  );
