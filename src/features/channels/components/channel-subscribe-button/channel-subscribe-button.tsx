import { Button } from "@/components/ui/button";
import { useIsSubscribed } from "@/features/auth/hooks/use-is-subscribed";
import { useSubscribeToChannel } from "@/features/channels/mutations/use-subscribe-to-channel";
import { ChannelBuyKeyButton } from "@/features/channels/components/channel-subscribe-button/channel-buy-key-button";
import { useChannelContext } from "@/features/profile/components/channel-context/channel-context";

export const ChannelSubscribeButton = () => {
  const { channelId, channelQuery } = useChannelContext();
  const [isSubscribed, subscribedQuery] = useIsSubscribed(channelId);
  const subscribe = useSubscribeToChannel();

  if (isSubscribed) {
    return <ChannelBuyKeyButton />;
  }

  return (
    <Button
      size="lg"
      className="w-full"
      variant={isSubscribed ? "secondary" : "default"}
      disabled={isSubscribed}
      pending={subscribedQuery.isLoading || channelQuery.isLoading}
      onClick={() => {
        if (!channelId) {
          return;
        }

        subscribe.mutate({
          channelId,
        });
      }}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </Button>
  );
};
