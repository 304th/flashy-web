"use client";

import { Button } from "@/components/ui/button";
import { StreamList } from "@/features/streams/components/stream-list/stream-list";
import { StreamIcon } from "@/components/ui/icons/stream";
import { useModals } from "@/hooks/use-modals";
import { useMe } from "@/features/auth/queries/use-me";

export default function ProfileStreamsPage() {
  const { openModal } = useModals();
  const { data: me } = useMe();

  if (!me) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 justify-center w-full">
      <div className="flex w-full justify-start gap-2">
        <Button variant="secondary" onClick={() => openModal("GoLiveModal")}>
          <StreamIcon />
          Go Live
        </Button>
      </div>
      <StreamList />
    </div>
  );
}
