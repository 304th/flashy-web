import { Button } from "@/components/ui/button";
import { useIsSubscribed } from "@/features/auth/hooks/use-is-subscribed";
import { useSubscribeToChannel } from "@/features/channels/mutations/use-subscribe-to-channel";

export const ChannelSubscribeButton = ({
  channelId,
}: {
  channelId: string;
}) => {
  const isSubscribed = useIsSubscribed(channelId);
  const subscribe = useSubscribeToChannel();

  return (
    <Button
      size="lg"
      className="w-full"
      variant={isSubscribed ? "secondary" : "default"}
      disabled={isSubscribed}
      onClick={() => {
        subscribe.mutate({
          channelId,
        });
      }}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </Button>
  );
};
