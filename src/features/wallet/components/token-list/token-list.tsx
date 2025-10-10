import { useMemo } from "react";
import { WalletTokenIcon } from "@/features/wallet/components/wallet-token-icon/wallet-token-icon";
import { useWalletBalance } from "@/features/wallet/queries/use-wallet-balance";
import {useBlazeInUsd} from "@/features/wallet/hooks/use-blaze-in-usd";

export const TokenList = () => {
  const { data: balance } = useWalletBalance();

  return <div className="flex flex-col gap-2">
    <p className="text-2xl text-white">Tokens</p>
    <div className="flex flex-col gap-2 divide-y">
      <GridHeader />
      <GridTable />
    </div>
  </div>
}

const GridTable = () => {
  const { data: balance } = useWalletBalance();
  const blazeInUSD = useBlazeInUsd(balance?.blaze);
  const tokensInWallet = useMemo(() => {
    if (!balance) {
      return [];
    }

    return Object.keys(balance).map((key) => {
      const amount = balance[key as WalletToken];

      return {
        id: key as WalletToken,
        amount,
        value: key === 'blaze' ? blazeInUSD : amount,
      }
    })
  }, [balance, blazeInUSD]);

  return <div className="grid grid-cols-3 w-full gap-1">
    {tokensInWallet.map(token => (
      <>
        <div className="flex gap-1 items-center py-2">
          <WalletTokenIcon token={token.id} />
          <p className="text-lg">{token.id.toUpperCase()}</p>
        </div>
        <div className="flex gap-1 items-center py-2 justify-end">
          <p>{token.amount}</p>
        </div>
        <div className="flex gap-1 items-center py-2 justify-end">
          <p className="text-white font-bold">${Number(token.value).toFixed(2)}</p>
        </div>
      </>
    ))}
  </div>
}

const GridHeader = () => {
  return <div className="grid grid-cols-3 gap-1 w-full py-2">
    <p>Name</p>
    <p className="inline-flex justify-end">Amount</p>
    <p className="inline-flex justify-end">Value</p>
  </div>
}