import { useState } from "react";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";
import { Copy, Check, Eye, EyeOff } from "lucide-react";

export interface StreamKeyModalProps {
  stream: Stream;
  onClose(): void;
}

export const StreamKeyModal = ({ stream, onClose }: StreamKeyModalProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showStreamKey, setShowStreamKey] = useState(false);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!stream.rtmpUrl || !stream.streamKey) {
    return (
      <ModalComponent onClose={onClose}>
        <div className="relative w-full max-w-2xl rounded-lg bg-background p-6">
          <CloseButton onClick={onClose} />
          <h2 className="mb-4 text-2xl font-bold">Stream Credentials</h2>
          <p className="text-muted-foreground">
            Stream credentials are not available for this stream.
          </p>
        </div>
      </ModalComponent>
    );
  }

  return (
    <ModalComponent onClose={onClose}>
      <div className="relative w-full max-w-2xl rounded-lg bg-background p-6">
        <CloseButton onClick={onClose} />

        <h2 className="mb-6 text-2xl font-bold">Stream Credentials</h2>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">RTMP URL</label>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(stream.rtmpUrl!, "rtmpUrl")}
                className="h-8"
              >
                {copiedField === "rtmpUrl" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <code className="block rounded bg-muted p-2 text-sm break-all">
              {stream.rtmpUrl}
            </code>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Stream Key</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowStreamKey(!showStreamKey)}
                  className="h-8"
                >
                  {showStreamKey ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Show
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(stream.streamKey!, "streamKey")}
                  className="h-8"
                >
                  {copiedField === "streamKey" ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
            <code className="block rounded bg-muted p-2 text-sm break-all">
              {showStreamKey ? stream.streamKey : "••••••••••••••••"}
            </code>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Keep your stream key private! Anyone with these credentials can stream
            to your channel.
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </ModalComponent>
  );
};
