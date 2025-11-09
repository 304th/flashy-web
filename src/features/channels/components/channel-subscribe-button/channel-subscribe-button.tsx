import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsSubscribed } from "@/features/auth/hooks/use-is-subscribed";
import { useProtectedAction } from "@/features/auth/hooks/use-protected-action";
import { useSubscribeToChannel } from "@/features/channels/mutations/use-subscribe-to-channel";
import { ChannelBuyKeyButton } from "@/features/channels/components/channel-subscribe-button/channel-buy-key-button";
import { ChannelSellKeyButton } from "@/features/channels/components/channel-subscribe-button/channel-sell-key-button";
import { useHasBoughtKey } from "@/features/keys/hooks/use-has-bought-key";
import { ChannelSubscribeAnimation } from "@/features/channels/components/channel-subscribe-button/channel-subscribe-animation";

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
  const [playAnimation, setPlayAnimation] = useState(false);

  if (hasBoughtKey) {
    return <ChannelSellKeyButton channel={channel} className={className} />;
  }

  return (
    <div className={`relative h-full ${className}`}>
      <ChannelSubscribeAnimation play={playAnimation} />
      {isSubscribed ? (
        <ChannelBuyKeyButton channel={channel} className={className} />
      ) : (
        <Button
          size="lg"
          className={`w-full bg-green-900 hover:bg-green-800 ${className}`}
          variant={isSubscribed ? "secondary" : "default"}
          disabled={isSubscribed}
          pending={subscribedQuery.isLoading || loading}
          onClick={requireAuth(() => {
            if (!channel || !channel.fbId) {
              return;
            }

            setPlayAnimation(true);
            setTimeout(() => setPlayAnimation(false), 1000);

            subscribe.mutate({
              channelId: channel.fbId,
            });
          })}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </Button>
      )}
    </div>
  );
};
