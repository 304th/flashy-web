import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

export const StreamWatchTimestamp = ({ timestamp }: { timestamp?: string }) => {
  if (!timestamp) {
    return null;
  }

  const timeAgo = useMemo(
    () =>
      formatDistanceToNow(new Date(timestamp), { addSuffix: true }).replace(
        "about",
        "",
      ),
    [timestamp],
  );

  return <span>{timeAgo}</span>;
};
