import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/ui/user-profile";
import { useBoughtKeysDetails } from "@/features/keys/queries/use-bought-keys-details";
import { useModals } from "@/hooks/use-modals";

export const BoughtKeysDetailsList = () => {
  const { data: boughtKeyDetails, query } = useBoughtKeysDetails();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl text-white">Tokens</p>
      <div className="flex flex-col gap-2 divide-y">
        <GridHeader />
        <GridTable />
      </div>
    </div>
  );
};

const GridHeader = () => {
  return (
    <div className="grid grid-cols-4 gap-1 w-full py-2">
      <p>Channel</p>
      <p className="inline-flex justify-end">Holders</p>
      <p className="inline-flex justify-end">Price</p>
      <div />
    </div>
  );
};

const GridTable = () => {
  const { data: boughtKeyDetails } = useBoughtKeysDetails();
  const { openModal } = useModals();

  return (
    <div className="grid grid-cols-4 w-full gap-1">
      {boughtKeyDetails?.map?.((boughtKeyDetails) => (
        <>
          <div className="flex gap-1 items-center py-2">
            <UserProfile user={boughtKeyDetails.user!} />
          </div>
          <div className="flex gap-1 items-center py-2 justify-end">
            <p>{boughtKeyDetails.holders.toLocaleString()}</p>
          </div>
          <div className="flex gap-1 items-center py-2 justify-end">
            <p>{boughtKeyDetails.buyPrice.toLocaleString()}</p>
          </div>
          <div className="flex gap-1 items-center py-2 justify-end">
            <Button
              variant="destructive"
              onClick={() => {
                openModal("SellKeyModal", {
                  user: {
                    fbId: boughtKeyDetails.user?.fbId,
                    username: boughtKeyDetails.user?.username,
                    userimage: boughtKeyDetails.user?.userimage,
                  },
                });
              }}
            >
              Sell
            </Button>
          </div>
        </>
      ))}
    </div>
  );
};
