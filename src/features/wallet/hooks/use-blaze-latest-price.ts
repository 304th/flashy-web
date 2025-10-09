import { useBlazeExchangeRates } from "@/features/wallet/queries/use-blaze-exchange-rates";

export const useBlazeLatestPrice = () => {
  const [exchangeRates] = useBlazeExchangeRates();

  return exchangeRates?.rate?.price.toFixed(8);
};
