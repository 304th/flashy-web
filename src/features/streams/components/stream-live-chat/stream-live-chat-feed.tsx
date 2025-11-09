import { useEffect, useRef } from "react";
import { useStreamChatMessages } from "@/features/streams/queries/use-stream-chat-messages";
import { Loadable } from "@/components/ui/loadable";
import { StreamLiveChatMessage } from "@/features/streams/components/stream-live-chat/stream-live-chat-message";
import { NotFound } from "@/components/ui/not-found";

export const StreamLiveChatFeed = ({ stream }: { stream: Stream }) => {
  const listRef = useRef<TODO>(null);
  const { data: messages, query } = useStreamChatMessages(stream._id);

  useEffect(() => {
    if (messages?.length) {
      listRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
    }
  }, [messages?.length]);

  return (
    <div className="flex flex-col-reverse h-full gap-1 overflow-scroll">
      <Loadable queries={[query] as any}>
        {() =>
          messages && messages.length > 0 ? (
            messages.map((message) => (
              <StreamLiveChatMessage
                chatMessage={message}
                stream={stream}
              />
            ))
          ) : (
            <NotFound>No messages yes</NotFound>
          )
        }
      </Loadable>
    </div>
  );
};
