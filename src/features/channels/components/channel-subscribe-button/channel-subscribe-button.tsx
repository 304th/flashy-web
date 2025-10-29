import { Button } from "@/components/ui/button";
import { useIsSubscribed } from "@/features/auth/hooks/use-is-subscribed";
import { useProtectedAction } from "@/features/auth/hooks/use-protected-action";
import { useSubscribeToChannel } from "@/features/channels/mutations/use-subscribe-to-channel";
import { ChannelBuyKeyButton } from "@/features/channels/components/channel-subscribe-button/channel-buy-key-button";
import { ChannelSellKeyButton } from "@/features/channels/components/channel-subscribe-button/channel-sell-key-button";
import { useHasBoughtKey } from "@/features/keys/hooks/use-has-bought-key";

export const ChannelSubscribeButton = ({
  channel,
  loading = false,
  className,
}: {
  channel?: Author;
  loading?: boolean;
  className?: string;
}) => {
  const [isSubscribed, subscribedQuery] = useIsSubscribed(channel?.fbId);
  const subscribe = useSubscribeToChannel();
  const hasBoughtKey = useHasBoughtKey(channel?.fbId);
  const { requireAuth } = useProtectedAction();

  if (hasBoughtKey) {
    return <ChannelSellKeyButton channel={channel} className={className} />;
  }

  if (isSubscribed) {
    return <ChannelBuyKeyButton channel={channel} className={className} />;
  }

  return (
    <Button
      size="lg"
      className={`w-full ${className}`}
      variant={isSubscribed ? "secondary" : "default"}
      disabled={isSubscribed}
      pending={subscribedQuery.isLoading || loading}
      onClick={requireAuth(() => {
        if (!channel || !channel.fbId) {
          return;
        }

        subscribe.mutate({
          channelId: channel.fbId,
        });
      })}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </Button>
  );
};
