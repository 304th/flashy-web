"use client";

import { Suspense, useMemo } from "react";
import { Loadable, LoadableError } from "@/components/ui/loadable";
import { Spinner } from "@/components/ui/spinner/spinner";
import { Separator } from "@/components/ui/separator";
import { ChatMessage } from "@/features/messaging/components/chat-message/chat-message";
import { useQueryParams } from "@/hooks/use-query-params";
import { useConversationMessages } from "@/features/messaging/queries/use-conversation-messages";
import { useConversationById } from "@/features/messaging/queries/use-conversation-by-id";
import { useActiveConversation } from "@/features/messaging/hooks/use-active-conversation";
import { ConversationNotAllowedError } from "@/features/messaging/components/conversation-not-allowed-error/conversation-not-allowed-error";
import { isToday, isYesterday, format } from "date-fns";

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
    return <NewlyCreatedChatMessages chatId={id} />;
  }

  return <ExistingChatMessages chatId={id} />;
};

const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatDateLabel = (date: Date): string => {
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  const day = date.getDate();
  const month = format(date, "MMMM");
  const year = format(date, "yyyy");
  return `${day}${getOrdinalSuffix(day)} of ${month} ${year}`;
};

const ExistingChatMessages = ({ chatId }: { chatId: string }) => {
  const { data: conversation, query: conversationQuery } =
    useConversationById(chatId);
  const { data: messages, query: messagesQuery } =
    useConversationMessages(chatId);

  const messagesWithSeparators = useMemo(() => {
    if (!messages) return [];

    const result: (Message | { type: "separator"; date: Date })[] = [];
    let lastDate: Date | null = null;

    for (const message of messages) {
      const messageDate = new Date(message.createdAt);
      const messageDay = format(messageDate, "yyyy-MM-dd");

      // Check if we need to add a separator
      if (lastDate === null) {
        // First message, add separator for its date
        result.push({ type: "separator", date: messageDate });
        lastDate = messageDate;
      } else {
        const lastDay = format(lastDate, "yyyy-MM-dd");
        if (messageDay !== lastDay) {
          // Different day, add separator
          result.push({ type: "separator", date: messageDate });
          lastDate = messageDate;
        }
      }

      result.push(message);
    }

    return result;
  }, [messages]);

  return (
    <div
      className="flex flex-col justify-end gap-2 items-center h-full mt-[72px]
        mb-[88px] pb-8"
    >
      <Loadable queries={[conversationQuery, messagesQuery] as any}>
        {() =>
          messagesWithSeparators.map((item, index) => {
            if ("type" in item && item.type === "separator") {
              return (
                <Separator key={`separator-${index}`}>
                  {formatDateLabel(item.date)}
                </Separator>
              );
            }
            return <ChatMessage key={item._id} message={item as Message} />;
          })
        }
      </Loadable>
    </div>
  );
};

const NewlyCreatedChatMessages = ({ chatId }: { chatId: string }) => {
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
