import { useBlazeExchangeRates } from "@/features/wallet/queries/use-blaze-exchange-rates";

export const WalletBlazeValueInUsd = () => {
  const [rate] = useBlazeExchangeRates();

  return <p className="text-4xl text-white font-bold">{rate?.rate?.price}</p>;
};
