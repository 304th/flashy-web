import { getQuery } from "@/lib/query";
import { getLinksPreview } from "@/features/social/utils/getLinksPreview";
import { keepPreviousData } from "@tanstack/query-core";

export const useLinksPreview = (links?: string[]) =>
  getQuery<LinkPreview[]>(
    ["link-preview", links],
    async () => getLinksPreview(links!),
    Boolean(links?.length),
    {
      placeholderData: keepPreviousData,
    },
  );
