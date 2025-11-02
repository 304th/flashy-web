"use client";

import { Suspense, useMemo } from "react";
import { Loadable } from "@/components/ui/loadable";
import { Spinner } from "@/components/ui/spinner/spinner";
import { Separator } from "@/components/ui/separator";
import { ChatMessage } from "@/features/messaging/components/chat-message/chat-message";
import { useQueryParams } from "@/hooks/use-query-params";
import { useConversationMessages } from "@/features/messaging/queries/use-conversation-messages";
import { useActiveConversation } from "@/features/messaging/hooks/use-active-conversation";
import { ConversationNotAllowedError } from "@/features/messaging/components/conversation-not-allowed-error/conversation-not-allowed-error";
import { isToday, isYesterday, format } from "date-fns";
import {
  ConversationEmptyMessages
} from "@/features/messaging/components/conversation-empty-messages/conversation-empty-messages";
import {useConversationById} from "@/features/messaging/queries/use-conversation-by-id";

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
  const { data: conversation, query: chatQuery } = useConversationById(chatId);
  const { data: messages, query: messagesQuery } =
    useConversationMessages(chatId);

  const messagesWithSeparators = useMemo(() => {
    if (!messages) {
      return [];
    }

    const result: (Message | { type: "separator"; date: Date })[] = [];
    let currentDayMessages: Message[] = [];
    let currentDay: string | null = null;

    for (const message of messages) {
      const messageDate = new Date(message.createdAt);
      const messageDay = format(messageDate, "yyyy-MM-dd");

      if (currentDay === null) {
        // First message
        currentDay = messageDay;
        currentDayMessages.push(message);
      } else if (messageDay === currentDay) {
        // Same day, add to current group
        currentDayMessages.push(message);
      } else {
        // Different day, finalize previous group
        // Add messages first, then separator (so separator appears on top with flex-col-reverse)
        result.push(...currentDayMessages);
        result.push({
          type: "separator",
          date: new Date(currentDayMessages[0].createdAt),
        });

        // Start new group
        currentDay = messageDay;
        currentDayMessages = [message];
      }
    }

    // Finalize last group
    if (currentDayMessages.length > 0) {
      result.push(...currentDayMessages);
      result.push({
        type: "separator",
        date: new Date(currentDayMessages[0].createdAt),
      });
    }

    return result;
  }, [messages]);

  return (
    <div
      className="flex flex-col-reverse gap-2 items-center h-full mt-[72px]
        mb-[88px] pb-8"
    >
      <Loadable queries={[messagesQuery, chatQuery] as any}>
        {() =>
          messagesWithSeparators && messagesWithSeparators.length ? messagesWithSeparators.map((item, index) => {
            if ("type" in item && item.type === "separator") {
              return (
                <Separator key={`separator-${index}`} className="!w-3/4 p-4">
                  {formatDateLabel(item.date)}
                </Separator>
              );
            }

            return <ChatMessage key={(item as TODO)._id} message={item as Message} />;
          }) : conversation ? <ConversationEmptyMessages conversation={conversation} /> : null
        }
      </Loadable>
    </div>
  );
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
