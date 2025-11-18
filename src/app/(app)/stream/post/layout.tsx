"use client";

import { type ReactNode, Suspense } from "react";
import { StreamChat } from "@/features/streams/components/stream-chat/stream-chat";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStreamById } from "@/features/streams/queries/use-stream-by-id";
import { StreamLiveChat } from "@/features/streams/components/stream-live-chat/stream-live-chat";

export default function StreamLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Suspense>
      <StreamLayoutComponent>{children}</StreamLayoutComponent>
    </Suspense>
  );
}

const StreamLayoutComponent = ({ children }: { children: ReactNode }) => {
  const id = useQueryParams("id");
  const { data: stream } = useStreamById(id!);

  return (
    <div className="relative flex gap-4 w-full max-w-video">
      <div className="w-7/10 overflow-y-auto">{children}</div>
      <div className="w-3/10">
        {stream && (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <StreamLiveChat stream={stream} />
              {/*<StreamChat streamId={stream._id} enabled={stream.chatEnabled} />*/}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
