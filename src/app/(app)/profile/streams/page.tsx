"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/hooks/use-modals";
import { useMe } from "@/features/auth/queries/use-me";
import { StreamList } from "@/features/streams/components/stream-list/stream-list";

export default function ProfileStreamsPage() {
  const { openModal } = useModals();
  const { data: currentUser } = useMe();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 justify-center w-full">
      <div className="flex w-full justify-start gap-2">
        <Button
          variant="secondary"
          onClick={() => openModal("StreamCreateModal")}
        >
          <PlusIcon />
          Create a stream
        </Button>
      </div>

      <StreamList userId={currentUser.fbId} showActions={true} />
    </div>
  );
}
