import {useMemo} from "react";
import {format } from "date-fns";
import {motion} from "framer-motion";
import {useConversationById} from "@/features/messaging/queries/use-conversation-by-id";
import {useConversationMessages} from "@/features/messaging/queries/use-conversation-messages";
import {Loadable} from "@/components/ui/loadable";
import {Separator} from "@/components/ui/separator";
import {ChatMessage} from "@/features/messaging/components/chat-message/chat-message";
import {
  ConversationEmptyMessages
} from "@/features/messaging/components/conversation-empty-messages/conversation-empty-messages";
import { formatDateLabel, hasSameTimestamp} from "@/features/messaging/utils/conversation-utils";
import { chatFeedAnimation } from "@/features/messaging/utils/chat-feed-animations";

export const ChatFeed = ({ chatId }: { chatId: string }) => {
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
      className="relative flex flex-col-reverse items-centent mt-[72px]
        mb-[88px] h-[calc(100vh-264px)]"
    >
      <div
        className="absolute top-0 left-0 right-0 h-6 pointer-events-none z-10 bg-gradient-to-b from-base-150 to-transparent"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none z-10 bg-gradient-to-t from-base-150 to-transparent"
      />
      <Loadable queries={[messagesQuery, chatQuery] as any} fullScreenForDefaults>
        {() =>
          messagesWithSeparators && messagesWithSeparators.length ? (
            // <div className="relative w-full bg-red-900" style={{ height: "calc(100vh - 200px - 96px)" }}>
            <div className="relative w-full h-full">
              <motion.div
                className="flex flex-col-reverse gap-2 items-center w-full h-full overflow-y-auto py-4"
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
              </motion.div>
            </div>
          ) : conversation ? (
            <ConversationEmptyMessages conversation={conversation} />
          ) : null
        }
      </Loadable>
    </div>
  );
};