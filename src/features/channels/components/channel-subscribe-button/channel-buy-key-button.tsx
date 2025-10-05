import { Button } from "@/components/ui/button";
import { useIsSubscribed } from "@/features/auth/hooks/use-is-subscribed";
import { useSubscribeToChannel } from "@/features/channels/mutations/use-subscribe-to-channel";
import { KeyIcon } from "@/components/ui/icons/key";
import {CheckIcon} from "@/components/ui/icons/check";

export const ChannelBuyKeyButton = ({
  channelId,
}: {
  channelId: string;
}) => {
  const isSubscribed = useIsSubscribed(channelId);
  const subscribe = useSubscribeToChannel();

  return <div className="flex items-center w-full rounded-md">
    <div className="inline-flex justify-between h-10 rounded-l-md text-base-800 px-3 bg-background border-base-400 shadow-xs items-center gap-2 whitespace-nowrap w-1/2 pointer-events-none">
      <CheckIcon />
      Subscribed
    </div>
    <button className="inline-flex justify-between h-10 rounded-r-md px-3 bg-[linear-gradient(to_right,#7500E9,#FD0FAC)] text-white border-base-400 shadow-xs items-center gap-2 whitespace-nowrap w-1/2 cursor-pointer">
      <KeyIcon />
      Buy Key
    </button>
  </div>
};
