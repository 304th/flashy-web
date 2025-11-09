import { KeyIcon } from "@/components/ui/icons/key";
import { CheckIcon } from "@/components/ui/icons/check";
import { useModals } from "@/hooks/use-modals";

export const ChannelBuyKeyButton = ({
  channel,
  className,
}: {
  channel?: Author;
  className?: string;
}) => {
  const { openModal } = useModals();

  return (
    <div
      className={`relative flex items-center w-full rounded-md border
        ${className} z-1`}
    >
      <div
        className="inline-flex justify-between h-10 rounded-l-md text-base-800
          px-3 bg-background border-base-400 shadow-xs items-center gap-2
          whitespace-nowrap w-1/2 pointer-events-none"
      >
        <CheckIcon />
        Subscribed
      </div>
      <button
        className="inline-flex justify-between h-10 rounded-r-md px-3
          bg-[linear-gradient(to_right,#7500E9,#FD0FAC)] text-white
          border-base-400 shadow-xs items-center gap-2 whitespace-nowrap w-1/2
          cursor-pointer"
        onClick={() => {
          openModal("BuyKeyModal", {
            user: {
              fbId: channel?.fbId,
              username: channel?.username,
              userimage: channel?.userimage,
            },
          });
        }}
      >
        <KeyIcon />
        Buy Key
      </button>
    </div>
  );
};
