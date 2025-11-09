import { useEffect, useState } from "react";
import { channel } from "@/lib/query-toolkit-v2";
import { streamViewersWebSocket } from "@/features/streams/services/stream-viewers-websocket";
import { liveStreamsCollection } from "@/features/streams/entities/live-streams.collection";
import { streamEntity } from "@/features/streams/entities/stream.entity";

/**
 * Hook to handle live updates for stream viewer counts
 * - Listens for viewer count updates and updates the stream entities
 * - Automatically joins/leaves the stream as a viewer when the hook mounts/unmounts
 */
export const useStreamViewersLiveUpdates = (streamId: string) => {
  const [viewerCount, setViewerCount] = useState<number | null>(null);

  useEffect(() => {
    console.log(`[StreamViewers] Hook mounted for stream ${streamId}`);
    console.log(
      `[StreamViewers] Initial connection state: ${streamViewersWebSocket.isConnected}`,
    );

    // Subscribe to connection changes to join stream once connected
    const unsubscribeConnection = streamViewersWebSocket.onConnectionChange(
      (connected) => {
        console.log(
          `[StreamViewers] Connection changed: ${connected} for stream ${streamId}`,
        );
        if (connected) {
          console.log(
            `[StreamViewers] Connected! Joining stream ${streamId}`,
          );
          streamViewersWebSocket.joinStream(streamId);
        }
      },
    );

    // If already connected, join immediately
    if (streamViewersWebSocket.isConnected) {
      console.log(`[StreamViewers] Already connected, joining stream ${streamId}`);
      streamViewersWebSocket.joinStream(streamId);
    } else {
      console.log(
        `[StreamViewers] Not connected yet, will join when connection is established`,
      );
    }

    // Subscribe to viewer count updates
    const unsubscribe = streamViewersWebSocket.subscribe((event) => {
      console.log(
        `[StreamViewers] Received event for stream ${event.streamId}, current stream: ${streamId}`,
        event,
      );

      // Only process events for this stream
      if (event.streamId !== streamId) {
        console.log(`[StreamViewers] Ignoring event for different stream`);
        return;
      }

      console.log(
        `[StreamViewers] Processing viewer count update for stream ${streamId}:`,
        event.viewers,
      );

      // Update local state
      setViewerCount(event.viewers);

      // Update the stream in the live streams collection
      void channel(liveStreamsCollection).update(streamId, (stream) => {
        stream.viewerCount = event.viewers;
      });

      // Update the stream entity
      void channel(streamEntity).update((stream) => {
        if (stream._id === streamId) {
          stream.viewerCount = event.viewers;
        }
      });
    });

    return () => {
      console.log(`[StreamViewers] Hook unmounting for stream ${streamId}`);
      // Leave the stream as a viewer
      streamViewersWebSocket.leaveStream(streamId);
      unsubscribe();
      unsubscribeConnection();
    };
  }, [streamId]);

  return {
    viewerCount,
    isConnected: streamViewersWebSocket.isConnected,
  };
};
