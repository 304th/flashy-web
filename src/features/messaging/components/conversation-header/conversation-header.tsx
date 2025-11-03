"use client";

import { Loadable } from "@/components/ui/loadable";
import { ConversationTitle } from "@/features/messaging/components/conversation-title/conversation-title";
import { ConversationThumbnail } from "@/features/messaging/components/conversation-thumbnail/conversation-thumbnail";
import { ConversationOnline } from "@/features/messaging/components/conversation-title/conversation-online";
import { useQueryParams } from "@/hooks/use-query-params";
import { useActiveConversation } from "@/features/messaging/hooks/use-active-conversation";

export const ConversationHeader = () => {
  const conversationId = useQueryParams("id");
  const isNewConversation = useQueryParams("new");

  if (!conversationId) {
    return null;
  }

  return (
    <div
      className="relative flex w-full rounded-md bg-base-250 p-4 min-h-[72px]
        z-1"
    >
      <div className="flex items-center gap-3">
        {isNewConversation ? (
          <NewlyCreatedConversationHeader />
        ) : (
          <ExistingConversationHeader />
        )}
      </div>
    </div>
  );
};

const NewlyCreatedConversationHeader = () => {
  const { data: conversation } = useActiveConversation();

  if (!conversation) {
    return null;
  }

  return (
    <>
      <ConversationThumbnail conversation={conversation} />
      <ConversationTitle conversation={conversation} />
    </>
  );
};

const ExistingConversationHeader = () => {
  const conversationQuery = useActiveConversation();

  return (
    <Loadable queries={[conversationQuery] as any}>
      {() =>
        conversationQuery.data ? (
          <>
            <ConversationThumbnail conversation={conversationQuery.data} />
            <div className="flex flex-col gap-0">
              <ConversationTitle conversation={conversationQuery.data} />
              <ConversationOnline conversation={conversationQuery.data} />
            </div>
          </>
        ) : null
      }
    </Loadable>
  );
};
