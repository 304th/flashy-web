'use client';

import { type ReactNode, Suspense } from "react";
import { ConversationsSidebar } from "@/features/messaging/components/conversations-sidebar/conversations-sidebar";
import {
  ConversationMessagesLayout
} from "@/features/messaging/components/conversation-messages-layout/conversation-messages-layout";

export default function MessagesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="relative flex gap-4 w-full">
      <div className="w-2/6">
        <Suspense>
          <ConversationsSidebar />
        </Suspense>
      </div>
      <div className="w-4/6">
        <ConversationMessagesLayout>
          {children}
        </ConversationMessagesLayout>
      </div>
    </div>
  );
}
