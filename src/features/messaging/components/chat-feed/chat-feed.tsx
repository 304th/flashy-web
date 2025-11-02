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
import { formatDateLabel} from "@/features/messaging/utils/conversation-utils";
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
      className="flex flex-col-reverse items-center h-full mt-[72px]
        mb-[88px] pb-8"
    >
      <Loadable queries={[messagesQuery, chatQuery] as any}>
        {() =>
          messagesWithSeparators && messagesWithSeparators.length ? (
            <motion.div
              className="flex flex-col-reverse gap-2 items-center h-full w-full"
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

                return (
                  <ChatMessage
                    key={(item as TODO)._id}
                    message={item as Message}
                  />
                );
              })}
            </motion.div>
          ) : conversation ? (
            <ConversationEmptyMessages conversation={conversation} />
          ) : null
        }
      </Loadable>
    </div>
  );
};