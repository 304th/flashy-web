import { Button } from "@/components/ui/button";
import { Radio, StopCircle } from "lucide-react";
import { useGoLive } from "@/features/streams/mutations/use-go-live";
import { useEndStream } from "@/features/streams/mutations/use-end-stream";

interface StreamControlsProps {
  stream: Stream;
}

export const StreamControls = ({ stream }: StreamControlsProps) => {
  const goLive = useGoLive();
  const endStream = useEndStream();

  const handleGoLive = async () => {
    try {
      await goLive.mutateAsync({ streamId: stream.id });
    } catch (error) {
      console.error("Failed to go live:", error);
    }
  };

  const handleEndStream = async () => {
    if (
      !confirm(
        "Are you sure you want to end this stream? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await endStream.mutateAsync({ streamId: stream.id });
    } catch (error) {
      console.error("Failed to end stream:", error);
    }
  };

  if (stream.status === "ended") {
    return (
      <div className="rounded-lg border bg-muted p-4 text-center">
        <p className="text-sm text-muted-foreground">This stream has ended</p>
      </div>
    );
  }

  if (stream.status === "cancelled") {
    return (
      <div className="rounded-lg border bg-muted p-4 text-center">
        <p className="text-sm text-muted-foreground">
          This stream was cancelled
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {!stream.isLive && stream.status !== "live" && (
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Ready to go live?</h3>
                <p className="text-sm text-muted-foreground">
                  Make sure your streaming software is connected and
                  broadcasting
                </p>
              </div>
              <Button
                onClick={handleGoLive}
                disabled={goLive.isPending}
                size="lg"
                className="bg-red-500 hover:bg-red-600"
              >
                <Radio className="mr-2 h-5 w-5" />
                {goLive.isPending ? "Starting..." : "Go Live"}
              </Button>
            </div>
          </div>
        )}

        {stream.isLive && (
          <div className="rounded-lg border border-red-500 bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3">
                    <span
                      className="animate-ping absolute inline-flex h-3 w-3
                        rounded-full bg-red-500 opacity-75"
                    ></span>
                    <span
                      className="relative inline-flex rounded-full h-3 w-3
                        bg-red-500"
                    ></span>
                  </span>
                  <span className="font-semibold text-red-500">LIVE</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <p className="text-sm text-muted-foreground">
                  You are currently broadcasting
                </p>
              </div>
              <Button
                onClick={handleEndStream}
                disabled={endStream.isPending}
                variant="destructive"
                size="lg"
              >
                <StopCircle className="mr-2 h-5 w-5" />
                {endStream.isPending ? "Ending..." : "End Stream"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
