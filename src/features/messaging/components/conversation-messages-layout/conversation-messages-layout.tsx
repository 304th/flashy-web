"use client";

import { ReactNode, Suspense } from "react";
import { ConversationHeader } from "@/features/messaging/components/conversation-header/conversation-header";
import { ConversationSendMessage } from "@/features/messaging/components/conversation-send-message/conversation-send-message";

export const ConversationMessagesLayout = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="relative flex flex-col h-full">
      <Suspense fallback={<div className="absolute top-0 w-full h-[72px]" />}>
        <div className="absolute top-0 w-full">
          <ConversationHeader />
        </div>
      </Suspense>
      <div className="flex flex-col h-full justify-center">{children}</div>
      <Suspense>
        <div
          className="absolute bottom-0 w-full shrink-0 bg-[#11111180]
            backdrop-blur-xl"
        >
          <ConversationSendMessage />
        </div>
      </Suspense>
    </div>
  );
};
