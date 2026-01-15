import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, RefreshCw, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRenewStreamKey } from "@/features/streams/mutations/use-renew-stream-key";
import { useProfileStream } from "@/features/profile/queries/use-profile-stream";
import { useModals } from "@/hooks/use-modals";
import { isStreamKeyConfirmed } from "@/features/streams/components/stream-key-confirm-modal/stream-key-confirm-modal";

export const GoLiveSecurityForm = () => {
  const { data: stream } = useProfileStream();
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [showRtmpUrl, setShowRtmpUrl] = useState(false);
  const pendingActionRef = useRef<"show" | "copy" | null>(null);
  const renewStreamKey = useRenewStreamKey();
  const { openModal } = useModals();

  useEffect(() => {
    if (stream) {
      setShowStreamKey(false);
      setShowRtmpUrl(false);
    }
  }, [stream]);

  const executeAction = (action: "show" | "copy") => {
    if (action === "show") {
      setShowStreamKey(true);
    } else if (action === "copy") {
      handleCopyStreamKey();
    }
  };

  const checkConfirmationAndExecute = (action: "show" | "copy") => {
    if (!stream?.streamKey) {
      return;
    }
    if (isStreamKeyConfirmed(stream.streamKey)) {
      executeAction(action);
    } else {
      pendingActionRef.current = action;
      openModal(
        "StreamKeyConfirmModal",
        {
          streamKey: stream.streamKey,
          onConfirm: () => {
            if (pendingActionRef.current) {
              executeAction(pendingActionRef.current);
              pendingActionRef.current = null;
            }
          },
        },
        { subModal: true }
      );
    }
  };

  const handleCopyStreamKey = async () => {
    if (!stream) {
      return;
    }

    try {
      await navigator.clipboard.writeText(stream.streamKey!);
      toast.success("Stream key copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy stream key:", error);
      toast.error("Failed to copy stream key");
    }
  };

  const handleCopyRtmpUrl = async () => {
    if (!stream) {
      return;
    }

    try {
      await navigator.clipboard.writeText(stream.rtmpUrl!);
      toast.success("RTMP URL copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy RTMP URL:", error);
      toast.error("Failed to copy RTMP URL");
    }
  };

  return (
    <div className="flex flex-col p-4 gap-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Stream Credentials</h3>
          <Button
            type="button"
            variant="secondary"
            className="w-[130px]"
            onClick={async () => {
              if (!stream) {
                return;
              }

              await renewStreamKey.mutateAsync({ streamId: stream._id });
            }}
            pending={renewStreamKey.isPending}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Renew Key
          </Button>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm">Stream Key</p>
          <div className="relative">
            <Input
              type={showStreamKey ? "text" : "password"}
              className="pr-10"
              disabled={!stream}
              value={stream?.streamKey}
              defaultValue={stream?.streamKey}
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="absolute right-12 top-1/2 -translate-y-1/2
                aspect-square p-0"
              onClick={() => checkConfirmationAndExecute("copy")}
              disabled={!stream?.streamKey}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="absolute right-3 top-1/2 -translate-y-1/2 aspect-square
                p-0"
              onClick={() => {
                if (showStreamKey) {
                  setShowStreamKey(false);
                } else {
                  checkConfirmationAndExecute("show");
                }
              }}
              disabled={!stream?.streamKey}
            >
              {showStreamKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <p className="text-sm">RTMP URL</p>
          <div className="relative">
            <Input
              type={showRtmpUrl ? "text" : "password"}
              className="pr-10"
              value={stream?.rtmpUrl}
              defaultValue={stream?.rtmpUrl}
              disabled={!stream}
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="absolute right-12 top-1/2 -translate-y-1/2
                aspect-square p-0"
              onClick={handleCopyRtmpUrl}
              disabled={!stream}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="absolute right-3 top-1/2 -translate-y-1/2 aspect-square
                p-0"
              onClick={() => setShowRtmpUrl((state) => !state)}
              disabled={!stream}
            >
              {showRtmpUrl ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
