import { useMemo } from "react";
import { useBlazeExchangeRates } from "@/features/wallet/queries/use-blaze-exchange-rates";

export type BlazeExchangeRateType = 'none' | 'increase' | 'decrease';

export const useBlazePriceTrend = (): BlazeExchangeRateType => {
  const [exchangeRates] = useBlazeExchangeRates();

  return useMemo(() => {
    if (!exchangeRates?.rate?.price || !exchangeRates?.oldRate?.price) {
      return 'none';
    }

    const trend = exchangeRates?.rate?.price - exchangeRates?.oldRate?.price;

    return trend === 0 ? 'none' : trend > 0 ? 'increase' : 'decrease';
  }, [exchangeRates?.rate?.price, exchangeRates?.oldRate?.price]);
}