import { Radio, Eye } from "lucide-react";

export const StreamCardStatus = ({
  stream,
}: {
  stream: Optimistic<Stream>;
}) => {
  const getStatusBadge = () => {
    switch (stream.status) {
      case "live":
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            <Radio className="h-3 w-3" />
            LIVE
          </span>
        );
      case "scheduled":
        return (
          <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
            Scheduled
          </span>
        );
      case "ended":
        return (
          <span className="rounded-full bg-gray-500 px-3 py-1 text-xs font-semibold text-white">
            Ended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Status Badge */}
      <div className="absolute bottom-1 left-1">{getStatusBadge()}</div>

      {/* Viewer Count */}
      {stream.isLive && (
        <div
          className="absolute bottom-1 right-1 flex items-center gap-1
            rounded-full bg-[#111111dd] px-3 py-1 text-xs font-semibold
            text-white"
        >
          <Eye className="h-3 w-3" />
          {stream.viewerCount.toLocaleString()}
        </div>
      )}
    </>
  );
};
