import { useMemo } from "react";
import { useWalletBalance } from "@/features/wallet/queries/use-wallet-balance";

export const useHasEnoughBalance = (price?: string | number) => {
  const { data: balance } = useWalletBalance();

  return useMemo(() => {
    if (!balance?.blaze || !price) {
      return true;
    }

    return Number(balance.blaze) >= Number(price);
  }, [balance?.blaze, price]);
};
