import { Calendar, Eye, Settings, Key, Trash2, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useModals } from "@/hooks/use-modals";
import { useDeleteStream } from "@/features/streams/mutations/use-delete-stream";
import { formatDistanceToNow } from "date-fns";

interface StreamCardProps {
  stream: Stream;
  showActions?: boolean;
}

export const StreamCard = ({
  stream,
  showActions = false,
}: StreamCardProps) => {
  const modals = useModals();
  const deleteStream = useDeleteStream();

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

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this stream?")) {
      deleteStream.mutate({ streamId: stream.id });
    }
  };

  const handleSettings = () => {
    modals.openModal("StreamSettingsModal", { stream });
  };

  const handleViewKey = () => {
    modals.openModal("StreamKeyModal", { stream });
  };

  return (
    <div
      className="group relative rounded-lg border bg-card overflow-hidden
        hover:shadow-lg transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full bg-muted">
        {stream.thumbnail ? (
          <img
            src={stream.thumbnail}
            alt={stream.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Radio className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">{getStatusBadge()}</div>

        {/* Viewer Count */}
        {stream.isLive && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1
              rounded-full bg-black/70 px-3 py-1 text-xs font-semibold
              text-white"
          >
            <Eye className="h-3 w-3" />
            {stream.viewerCount.toLocaleString()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg line-clamp-2 mb-1">
              {stream.title}
            </h3>

            {stream.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {stream.description}
              </p>
            )}

            {/* Author Info */}
            <div className="flex items-center gap-2">
              <UserAvatar
                avatar={stream.author.userimage}
                className="h-8 w-8"
              />
              <span className="text-sm font-medium">
                {stream.author.username}
              </span>
            </div>

            {/* Schedule Info */}
            {stream.scheduledAt && stream.status === "scheduled" && (
              <div
                className="mt-2 flex items-center gap-1 text-xs
                  text-muted-foreground"
              >
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(stream.scheduledAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSettings}
              className="flex-1"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>

            {stream.streamKey && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewKey}
                className="flex-1"
              >
                <Key className="mr-2 h-4 w-4" />
                Stream Key
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={deleteStream.isPending}
              className="text-destructive hover:bg-destructive
                hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
