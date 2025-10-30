"use client";

import { Suspense } from "react";
import { useQueryParams } from "@/hooks/use-query-params";
import { useConversationMessages } from "@/features/messaging/queries/use-conversation-messages";

export default function ChatMessagesPage() {
  return (
    <Suspense>
      <ChatMessagesByIdPage />
    </Suspense>
  );
}

const ChatMessagesByIdPage = () => {
  const id = useQueryParams("id");
  const { data: message, query } = useConversationMessages(id);

  return null;
};
