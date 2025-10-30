"use client";

import { Suspense } from "react";
import { Loadable } from "@/components/ui/loadable";
import { useQueryParams } from "@/hooks/use-query-params";
import { useConversationMessages } from "@/features/messaging/queries/use-conversation-messages";
import {
  ConversationEmptyMessages
} from "@/features/messaging/components/conversation-empty-messages/conversation-empty-messages";
import { useConversationById } from "@/features/messaging/queries/use-conversation-by-id";

export default function ChatMessagesPage() {
  return (
    <Suspense>
      <ChatMessagesByIdPage />
    </Suspense>
  );
}

const ChatMessagesByIdPage = () => {
  const id = useQueryParams("id");
  const { data: conversation, query: conversationQuery } = useConversationById(id);
  const { data: messages, query: messagesQuery } = useConversationMessages(id);

  return <div className="flex flex-col justify-end items-center h-full mt-[72px] mb-[88px] pb-8">
    <Loadable queries={[conversationQuery, messagesQuery] as any}>
      {() => !messages || !messages.length ? <ConversationEmptyMessages conversation={conversation!} /> : null}
    </Loadable>
  </div>
};
