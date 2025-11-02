import { useEffect, useMemo, useRef } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useConversationById } from "@/features/messaging/queries/use-conversation-by-id";
import { useConversationMessages } from "@/features/messaging/queries/use-conversation-messages";
import { Loadable } from "@/components/ui/loadable";
import { Separator } from "@/components/ui/separator";
import { ChatMessage } from "@/features/messaging/components/chat-message/chat-message";
import { ConversationEmptyMessages } from "@/features/messaging/components/conversation-empty-messages/conversation-empty-messages";
import { Spinner } from "@/components/ui/spinner/spinner";
import {
  formatDateLabel,
  hasSameTimestamp,
} from "@/features/messaging/utils/conversation-utils";
import { chatFeedAnimation } from "@/features/messaging/utils/chat-feed-animations";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useQueryClient } from "@tanstack/react-query";
import { useMe } from "@/features/auth/queries/use-me";

export const ChatFeed = ({ chatId }: { chatId: string }) => {
  const unread = useRef<boolean>(false);
  const { data: me } = useMe();
  const queryClient = useQueryClient();

  const { data: conversation, query: chatQuery } = useConversationById(chatId);
  const { data: messages, query: messagesQuery } =
    useConversationMessages(chatId);

  useEffect(() => {
    if (messages) {
      queryClient.setQueryData<Conversation[]>(
        ["me", me?.fbId, "unread", "conversations"],
        (unreadChats) => unreadChats?.filter((chat) => chat._id !== chatId),
      );
    }
  }, [messages]);

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

  const scrollRef = useInfiniteScroll({
    query: messagesQuery,
    threshold: 0.01,
  });

  return (
    <div
      className="relative flex flex-col items-centent mt-[72px] mb-[88px]
        h-[calc(100vh-264px)]"
    >
      <div
        className="absolute top-0 left-0 right-0 h-6 pointer-events-none z-10
          bg-gradient-to-b from-base-150 to-transparent"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none z-10
          bg-gradient-to-t from-base-150 to-transparent"
      />
      <Loadable
        queries={[messagesQuery, chatQuery] as any}
        fullScreenForDefaults
      >
        {() =>
          messagesWithSeparators && messagesWithSeparators.length ? (
            <motion.div
              className="flex flex-col-reverse gap-2 items-center w-full h-full
                overflow-y-auto py-4"
              initial="hidden"
              animate="show"
              variants={chatFeedAnimation.container}
            >
              {messagesWithSeparators.map((item, index) => {
                if ("type" in item && item.type === "separator") {
                  return (
                    <Separator
                      key={`separator-${index}`}
                      className="!w-3/4 p-4"
                    >
                      {formatDateLabel(item.date)}
                    </Separator>
                  );
                }

                const message = item as Message;
                // Determine if this message should show its timestamp
                // Show timestamp only on the first message in a group of adjacent messages with same timestamp
                // With flex-col-reverse, older messages appear higher visually
                let showTimestamp = true;
                const prevMessageIndex = index - 1;

                // If there's a previous item, check it
                if (prevMessageIndex >= 0) {
                  const prevItem = messagesWithSeparators[prevMessageIndex];

                  // If previous item is a separator, this is the first message of a new day group
                  // Show its timestamp (it's the first in the group)
                  if ("type" in prevItem && prevItem.type === "separator") {
                    showTimestamp = true;
                  } else {
                    // Previous item is a message - check if they have the same timestamp
                    const prevMessage = prevItem as Message;
                    if (hasSameTimestamp(message, prevMessage)) {
                      // Same timestamp as previous message - hide this one
                      // Only the first (oldest) message in the group shows the timestamp
                      showTimestamp = false;
                    } else {
                      // Different timestamp - show this one (it's the first of a new group)
                      showTimestamp = true;
                    }
                  }
                } else {
                  // This is the first message in the array (oldest chronologically)
                  // Show its timestamp - it's the first in the group
                  showTimestamp = true;
                }

                return (
                  <ChatMessage
                    key={message._id}
                    message={message}
                    showTimestamp={showTimestamp}
                  />
                );
              })}
              <div ref={scrollRef} />
              {messagesQuery.hasNextPage &&
                messagesQuery.isFetchingNextPage && (
                  <div className="flex w-full justify-center">
                    <Spinner />
                  </div>
                )}
            </motion.div>
          ) : conversation ? (
            <ConversationEmptyMessages conversation={conversation} />
          ) : null
        }
      </Loadable>
    </div>
  );
};
