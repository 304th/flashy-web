"use client";

import { type ReactNode, Suspense } from "react";
import { StreamChat } from "@/features/streams/components/stream-chat/stream-chat";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStreamById } from "@/features/streams/queries/use-stream-by-id";

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
    <div className="relative flex gap-4 w-full h-[calc(100vh-80px)]">
      <div className="w-7/10 overflow-y-auto">{children}</div>
      <div className="w-3/10 border-l border-border">
        {stream && (
          <div className="h-full flex flex-col">
            <div className="border-b border-border p-4">
              <h2 className="font-semibold text-lg">Live Chat</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <StreamChat streamId={stream.id} enabled={stream.chatEnabled} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
