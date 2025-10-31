"use client";

import { Loadable } from "@/components/ui/loadable";
import { ConversationTitle } from "@/features/messaging/components/conversation-title/conversation-title";
import { ConversationThumbnail } from "@/features/messaging/components/conversation-thumbnail/conversation-thumbnail";
import { useQueryParams } from "@/hooks/use-query-params";
import { useConversationById } from "@/features/messaging/queries/use-conversation-by-id";

export const ConversationHeader = () => {
  const conversationId = useQueryParams("id");
  const { data: conversation, query } = useConversationById(conversationId);

  return (
    <div
      className="relative flex w-full rounded-md bg-base-250 p-4 min-h-[72px]
        z-1"
    >
      <div className="flex items-center gap-3">
        <Loadable queries={[query]}>
          {() =>
            conversation ? (
              <>
                <ConversationThumbnail conversation={conversation} />
                <ConversationTitle conversation={conversation} />
              </>
            ) : null
          }
        </Loadable>
      </div>
    </div>
  );
};
