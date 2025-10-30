"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { ConversationPreview } from "@/features/messaging/components/conversations-sidebar/conversation-preview";
import { useModals } from "@/hooks/use-modals";
import { useProfileConversations } from "@/features/profile/queries/use-profile-conversations";

export const ConversationsSidebar = () => {
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
      <div className="flex w-full items-center justify-between p-4 border-b">
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
        <Loadable queries={[query] as any} fullScreenForDefaults>
          {() =>
            !conversations || !conversations.length ? (
              <NotFound className="p-4">Chats not found</NotFound>
            ) : (
              conversations.map((conversation) => (
                <ConversationPreview
                  key={conversation._id}
                  conversation={conversation}
                />
              ))
            )
          }
        </Loadable>
      </div>
    </div>
  );
};
