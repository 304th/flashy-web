"use client";

import { Suspense, useMemo } from "react";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useQueryParams } from "@/hooks/use-query-params";
import { useActiveConversation } from "@/features/messaging/hooks/use-active-conversation";
import { ConversationNotAllowedError } from "@/features/messaging/components/conversation-not-allowed-error/conversation-not-allowed-error";
import { ChatFeed } from "@/features/messaging/components/chat-feed/chat-feed";

export default function ChatMessagesPage() {
  return (
    <Suspense>
      <ChatMessages />
    </Suspense>
  );
}

const ChatMessages = () => {
  const id = useQueryParams("id");
  const newChat = useQueryParams("new");

  if (!id) {
    return null;
  }

  if (newChat) {
    return <NewlyCreatedChatMessages />;
  }

  return <ChatFeed chatId={id} />;
};

const NewlyCreatedChatMessages = () => {
  const { data: conversation } = useActiveConversation();

  return (
    <div
      className="flex flex-col justify-end gap-2 items-center h-full mt-[72px]
        mb-[88px] pb-8"
    >
      {conversation?._optimisticStatus === "pending" ? (
        <Spinner />
      ) : conversation?._optimisticError ? (
        <ConversationNotAllowedError error={conversation._optimisticError} />
      ) : null}
    </div>
  );
};
