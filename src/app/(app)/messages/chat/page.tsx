"use client";

import { Suspense } from "react";
import { Loadable } from "@/components/ui/loadable";
import { ChatMessage } from "@/features/messaging/components/chat-message/chat-message";
import { useQueryParams } from "@/hooks/use-query-params";
import { useConversationMessages } from "@/features/messaging/queries/use-conversation-messages";
import { ConversationEmptyMessages } from "@/features/messaging/components/conversation-empty-messages/conversation-empty-messages";
import { useConversationById } from "@/features/messaging/queries/use-conversation-by-id";
import { useConversationMessagesWithUser } from "@/features/messaging/queries/use-conversation-messages-with-user";
import {useNewConversationUser} from "@/features/messaging/hooks/use-new-conversation-user";

export default function ChatMessagesPage() {
  return (
    <Suspense>
      <ChatMessages />
    </Suspense>
  );
}

const ChatMessages = () => {
  const id = useQueryParams("id");
  const userId = useQueryParams("u");
  const newChat = useQueryParams("new");

  if (id) {
    return <ChatMessagesByIdPage chatId={id} />
  }

  if (userId) {
    return <ChatMessagesByUserIdPage userId={userId} newChat={Boolean(newChat)} />
  }
}

const ChatMessagesByIdPage = ({ chatId }: { chatId: string }) => {
  const { data: conversation, query: conversationQuery } =
    useConversationById(chatId);
  const { data: messages, query: messagesQuery } = useConversationMessages(chatId);

  return (
    <div
      className="flex flex-col justify-end gap-2 items-center h-full mt-[72px]
        mb-[88px] pb-8"
    >
      <Loadable queries={[conversationQuery, messagesQuery] as any}>
        {() =>
          messages?.map((message) => (
            <ChatMessage key={message._id} message={message} />
          ))
        }
      </Loadable>
    </div>
  );
};

const ChatMessagesByUserIdPage = ({ userId, newChat }: { userId: string; newChat: boolean; }) => {
  const { data: messages, query } = useConversationMessagesWithUser(userId);

  return (
    <div
      className="flex flex-col justify-end gap-2 items-center h-full mt-[72px]
        mb-[88px] pb-8"
    >
      <Loadable queries={[query] as any} noFallback={Boolean(newChat)}>
        {() =>
          !messages || messages.length === 0 ? <ConversationEmptyMessages userId={userId} /> : messages?.map((message) => (
            <ChatMessage key={message._id} message={message} />
          ))
        }
      </Loadable>

    </div>
  );
};
