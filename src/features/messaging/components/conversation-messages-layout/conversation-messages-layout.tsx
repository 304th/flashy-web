'use client';

import {ReactNode, Suspense} from "react";
import { ConversationSendMessage } from "@/features/messaging/components/conversation-send-message/conversation-send-message";

export const ConversationMessagesLayout = ({ children }: { children: ReactNode }) => {
  return <div className="relative flex flex-col h-full">
    {children}
    <Suspense>
      <div
        className="sticky bottom-0 w-full shrink-0 bg-[#11111180] backdrop-blur-xl"
      >
        <ConversationSendMessage />
      </div>
    </Suspense>
  </div>
}