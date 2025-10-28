"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/hooks/use-modals";
import { useProfilePlaylists } from "@/features/profile/queries/use-profile-playlists";
import { Loadable } from "@/components/ui/loadable";
import { Playlist } from "@/features/video/components/playlist/playlist";
import { NotFound } from "@/components/ui/not-found";

const videoTabs = [
  {
    key: "published",
    label: "Published",
  },
  {
    key: "draft",
    label: "Drafts",
  },
];

export default function ProfileVideoPage() {
  const { openModal } = useModals();
  const { data: playlists, query } = useProfilePlaylists();

  return (
    <div className="flex flex-col gap-4 justify-center w-full">
      <div className="flex w-full justify-start gap-2">
        <Button
          variant="secondary"
          onClick={() => openModal("PlaylistCreateModal")}
        >
          <PlusIcon />
          Create a playlist
        </Button>
      </div>
      <div className="flex gap-4 w-full justify-center">
        <div className="flex gap-4 w-full flex-wrap">
          <Loadable queries={[query as any]}>
            {() =>
              !playlists || playlists?.length > 0 ? (
                playlists?.map((playlist) => (
                  <Playlist key={playlist._id} playlist={playlist} />
                ))
              ) : (
                <div className="flex w-full justify-center">
                  <NotFound>Playlists not found</NotFound>
                </div>
              )
            }
          </Loadable>
        </div>
      </div>
    </div>
  );
}
