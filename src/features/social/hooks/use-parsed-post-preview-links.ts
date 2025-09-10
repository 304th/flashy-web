import { useMemo } from "react";
import { useDebouncedValue } from "@tanstack/react-pacer/debouncer";
import { useLinksPreview } from "@/features/social/queries/use-links-preview";

export const useParsedPostLinkPreviews = (
  description: string,
  wait: number = 500,
) => {
  const previewUrls = useMemo(
    () =>
      description.match(
        /https?:\/\/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:\/[^?\s]*)?(?:\?[^?\s]*)?/g,
      ) || [],
    [description],
  );

  const [debouncedPreviewLinks] = useDebouncedValue(previewUrls, { wait });
  const [loadedLinkPreviews, query] = useLinksPreview(debouncedPreviewLinks);

  return [previewUrls, loadedLinkPreviews, query] as const;
};
