"use client";

import { Loadable } from "@/components/ui/loadable";
import { ConversationTitle } from "@/features/messaging/components/conversation-title/conversation-title";
import { ConversationThumbnail } from "@/features/messaging/components/conversation-thumbnail/conversation-thumbnail";
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
        {
          isNewConversation ? <NewlyCreatedConversationHeader conversationId={conversationId} /> : <ExistingConversationHeader conversationId={conversationId} />
        }
      </div>
    </div>
  );
};

const NewlyCreatedConversationHeader = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const { data: conversation } = useActiveConversation();

  if (!conversation) {
    return null;
  }

  return (
    <>
      <ConversationThumbnail conversation={conversation} />
      <ConversationTitle conversation={conversation} />
    </>
  )
};

const ExistingConversationHeader = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const conversationQuery = useActiveConversation();

  return (
    <Loadable queries={[conversationQuery] as any}>
      {() =>
        conversationQuery.data ? (
          <>
            <ConversationThumbnail conversation={conversationQuery.data} />
            <ConversationTitle conversation={conversationQuery.data} />
          </>
        ) : null
      }
    </Loadable>
  );
};
