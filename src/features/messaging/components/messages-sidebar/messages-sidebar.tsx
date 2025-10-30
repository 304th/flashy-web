'use client';

import {PlusIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Loadable} from "@/components/ui/loadable";
import {NotFound} from "@/components/ui/not-found";
import {useProfileConversations} from "@/features/profile/queries/use-profile-conversations";

export const MessagesSidebar = () => {
  const { data: conversations, query } = useProfileConversations();

  return <div className="flex flex-col rounded-md bg-base-300">
    <div className="flex flex-col w-full px-5 py-4">
      <p className="text-white text-lg font-medium">Direct Messaging</p>
    </div>
    <div className="flex w-full items-center justify-between px-5 py-3 border-b">
      <p>Chats:</p>
      <Button variant="secondary">
        <PlusIcon />
        Add a chat
      </Button>
    </div>
    <div className="flex flex-col w-full p-5">
      <Loadable queries={[query] as any} fullScreenForDefaults>
        {() => !conversations ? <NotFound>Chats not found</NotFound> : null}
      </Loadable>
    </div>
  </div>
}