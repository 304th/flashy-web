"use client";

import { Loadable } from "@/components/ui/loadable";
import { Playlist } from "@/features/video/components/playlist/playlist";
import { NotFound } from "@/components/ui/not-found";
import { useChannelPlaylists } from "@/features/channels/queries/use-channel-playlists";
import { useChannelContext } from "@/features/profile/components/channel-context/channel-context";

export default function ChannelPlaylistsPage() {
  const { channelId } = useChannelContext();
  const { data: playlists, query } = useChannelPlaylists({ channelId });

  return (
    <div className="flex flex-col gap-4 justify-center w-full">
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
