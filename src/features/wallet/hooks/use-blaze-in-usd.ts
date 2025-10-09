import { useMemo } from "react";
import { useBlazeExchangeRates } from "@/features/wallet/queries/use-blaze-exchange-rates";

export const useBlazeInUsd = (blaze?: string) => {
  const [exchangeRates] = useBlazeExchangeRates();

  return useMemo(() => {
    if (blaze && exchangeRates?.rate.price) {
      return (Number(blaze) * exchangeRates?.rate.price).toString();
    }
  }, [blaze, exchangeRates?.rate]);
};
