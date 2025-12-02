import { useLiveEntity } from "@/lib/query-toolkit-v2";
import { walletBalanceEntity } from "@/features/wallet/entities/wallet-balance.entity";
import { useMe } from "@/features/auth/queries/use-me";

export const useWalletBalance = () => {
  const { data: me } = useMe();

  return useLiveEntity<WalletBalance>({
    entity: walletBalanceEntity,
    queryKey: ["me", me?.fbId, "wallet", "balance"],
    options: {
      enabled: Boolean(me),
    },
  });
};
