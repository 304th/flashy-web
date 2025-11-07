import { useEffect } from "react";
import { channel } from "@/lib/query-toolkit-v2";
import { liveStreamsCollection } from "@/features/streams/entities/live-streams.collection";
import { streamsWebSocket } from "@/features/streams/services/streams-websocket";

/**
 * Hook to handle live updates for streams
 * When a stream update arrives via WebSocket, the stream is updated in the collection
 */
export const useStreamsLiveUpdates = () => {
  useEffect(() => {
    return streamsWebSocket.subscribe((stream) => {
      console.log("stream_updates", stream);
      void channel(liveStreamsCollection).prepend(stream);
    });
  }, []);

  return {
    isConnected: streamsWebSocket.isConnected,
  };
};
