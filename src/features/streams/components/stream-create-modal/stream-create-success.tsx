import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { type CreateStreamResponse } from "@/features/streams/mutations/use-create-stream";

interface StreamCreateSuccessProps {
  stream: CreateStreamResponse;
  onClose(): void;
}

export const StreamCreateSuccess = ({
  stream,
  onClose,
}: StreamCreateSuccessProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showStreamKey, setShowStreamKey] = useState(false);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
        <p className="text-sm text-green-800 dark:text-green-200">
          Your stream is ready! Use these credentials to connect your streaming software (OBS, Streamlabs, etc.) and start broadcasting.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">RTMP URL</label>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(stream.rtmpUrl, "rtmpUrl")}
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
                onClick={() => handleCopy(stream.streamKey, "streamKey")}
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

      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          Next steps:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
          <li>Open your streaming software (OBS, Streamlabs, etc.)</li>
          <li>Go to Settings → Stream</li>
          <li>Paste the RTMP URL and Stream Key</li>
          <li>Start streaming in your software</li>
          <li>Come back here and click "Go Live" to make your stream visible</li>
        </ol>
      </div>

      <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
        <p className="text-xs text-yellow-800 dark:text-yellow-200">
          Note: You can only have one active stream at a time. End or delete this stream before creating another.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={onClose}>Done</Button>
      </div>
    </div>
  );
};
