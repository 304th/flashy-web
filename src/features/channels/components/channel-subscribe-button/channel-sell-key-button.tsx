import { Button } from "@/components/ui/button";
import { KeyIcon } from "@/components/ui/icons/key";
import { useModals } from "@/hooks/use-modals";

export const ChannelSellKeyButton = ({
  channel,
  className,
}: {
  channel?: Author;
  className?: string;
}) => {
  const { openModal } = useModals();

  return (
    <Button
      size="lg"
      className={`w-full justify-between border-red-500 hover:border-red-500
        hover:bg-base-300 ${className}`}
      variant="secondary"
      onClick={() => {
        openModal("SellKeyModal", {
          user: {
            fbId: channel?.fbId,
            username: channel?.username,
            userimage: channel?.userimage,
          },
        });
      }}
    >
      <div className="scale-150">
        <KeyIcon />
      </div>
      Sell Key
    </Button>
  );
};
