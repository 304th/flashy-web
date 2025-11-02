"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { ConversationPreview } from "@/features/messaging/components/conversations-sidebar/conversation-preview";
import { useModals } from "@/hooks/use-modals";
import { useProfileConversations } from "@/features/profile/queries/use-profile-conversations";
import { useQueryParams } from "@/hooks/use-query-params";
import { useMe } from "@/features/auth/queries/use-me";

export const ConversationsSidebar = () => {
  const activeConversationId = useQueryParams("id");
  const { query: meQuery } = useMe();
  const { data: conversations, query } = useProfileConversations();
  const { openModal } = useModals();

  return (
    <div
      className="flex flex-col rounded-md bg-base-250 overflow-hidden
        h-[calc(100vh-100px)]"
    >
      <div className="flex flex-col w-full p-4">
        <p className="text-white text-lg font-medium">Direct Messaging</p>
      </div>
      <div
        className="flex w-full items-center px-4 pb-4 border-b justify-between"
      >
        <p>Chats:</p>
        <Button
          variant="secondary"
          onClick={() => openModal("ConversationCreateModal")}
        >
          <PlusIcon />
          Add a chat
        </Button>
      </div>
      <div className="flex flex-col w-full">
        <Loadable
          queries={[query, meQuery] as any}
          fullScreenForDefaults
          defaultFallbackClassname="m-8"
        >
          {() =>
            !conversations || !conversations.length ? (
              <NotFound className="p-4">Chats not found</NotFound>
            ) : (
              conversations.map((conversation) => (
                <ConversationPreview
                  key={conversation._id}
                  conversation={conversation}
                  isActive={activeConversationId === conversation._id}
                />
              ))
            )
          }
        </Loadable>
      </div>
    </div>
  );
};
