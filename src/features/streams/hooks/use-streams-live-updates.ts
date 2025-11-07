import { useEffect } from "react";
import { channel } from "@/lib/query-toolkit-v2";
import { liveStreamsCollection } from "@/features/streams/entities/live-streams.collection";
import { profileStreamEntity } from "@/features/profile/entities/profile-stream.entity";
import { streamsWebSocket } from "@/features/streams/services/streams-websocket";

/**
 * Hook to handle live updates for streams
 * When a stream update arrives via WebSocket, the stream is updated in the collection
 */
export const useStreamsLiveUpdates = () => {
  useEffect(() => {
    const unsubscribe = streamsWebSocket.subscribe((stream) => {
      void channel(liveStreamsCollection).prepend(stream);
      void channel(profileStreamEntity).update((profileStream) => {
        if (profileStream._id === stream._id) {
          profileStream.isLive = stream.isLive;
          profileStream.status = stream.status;
          profileStream.startedAt = stream.startedAt;
          profileStream.endedAt = stream.endedAt;
        }
      })
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isConnected: streamsWebSocket.isConnected,
  };
};
