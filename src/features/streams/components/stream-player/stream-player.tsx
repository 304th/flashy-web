import MuxPlayer from "@mux/mux-player-react/lazy";

export const StreamPlayer = ({ playbackId }: { playbackId: string }) => {
  return (
    <MuxPlayer
      streamType="on-demand"
      // playbackId="a4nOgmxGWg6gULfcBbAa00gXyfcwPnAFldF8RdsNyk8M"
      playbackId={playbackId}
      accentColor="#0f8259"
    />
  );
};
