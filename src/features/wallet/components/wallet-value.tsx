import { Loadable } from "@/components/ui/loadable";
import { BalanceValue } from "@/features/wallet/components/balance-value";
import { BlazeBigIcon } from "@/components/ui/icons/blaze-big";
import { useBlazeBalance } from "@/features/wallet/queries/use-blaze-balance";
import { useBlazeInUsd } from "@/features/wallet/hooks/use-blaze-in-usd";
import {useBlazePriceTrend} from "@/features/wallet/hooks/use-blaze-price-trend";
import {useBlazeLatestPrice} from "@/features/wallet/hooks/use-blaze-latest-price";
import {useMe} from "@/features/auth/queries/use-me";

export const WalletValue = () => {
  const { query: meQuery } = useMe();
  const { data: balance, query: balanceQuery } = useBlazeBalance();
  const blazeInUsd = useBlazeInUsd(balance?.blaze);
  const latestPrice = useBlazeLatestPrice()
  const blazePriceTrend = useBlazePriceTrend();

  return <div className="grid grid-cols-3 gap-1">
    <p>Wallet Value</p>
    <p>USD</p>
    <p className="inline-flex justify-end">Price</p>
    <div className="flex items-center gap-2 h-10">
      <Loadable queries={[balanceQuery, meQuery]}>
        {() => <>
          <BlazeBigIcon />
          <p className="text-4xl text-white font-bold">
            <BalanceValue balance={balance?.blaze || '0.0'} />
          </p>
        </>}
      </Loadable>
    </div>
    <div className="flex items-center gap-2 h-10">
      <p className="text-xl text-white font-bold">
        <Loadable queries={[balanceQuery, meQuery]}>
          {() => <BalanceValue balance={blazeInUsd || '0.0'} prefix="$" />}
        </Loadable>
      </p>
    </div>
    <div className="flex items-center gap-2 justify-end h-10">
      <Loadable queries={[balanceQuery, meQuery]}>
        {() =>       <p className={`text-xl text-white font-bold ${blazePriceTrend === 'increase' ? '!text-green-500' : blazePriceTrend === 'decrease' ? '!text-red-500' : '!text-base-800'}`}>
          ${latestPrice}
        </p>}
      </Loadable>

    </div>
  </div>
}