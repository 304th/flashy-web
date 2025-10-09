import {BlazeIcon} from "@/components/ui/icons/blaze";
import {Button} from "@/components/ui/button";
import { BalanceValue } from "@/features/wallet/components/balance-value";
import {useBlazeBalance} from "@/features/wallet/queries/use-blaze-balance";
import {Loadable} from "@/components/ui/loadable";

export const BalanceButton = () => {
  const { data: balance, query } = useBlazeBalance();

  return <Button size="sm" variant="secondary">
    <Loadable queries={[query]}>
      {() => <BalanceValue balance={balance?.blaze || '0.0'} />}
    </Loadable>
    <div className="scale-150">
      <BlazeIcon />
    </div>
  </Button>
}