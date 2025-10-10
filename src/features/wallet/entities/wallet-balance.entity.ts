import { createEntity } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export const walletBalanceEntity = createEntity<WalletBalance>({
  async sourceFrom() {
    const data = await api
      .get("users/blaze")
      .json<{
        blaze: string;
        usdc: string;
        usdt: string /*blazeAllowance: string;*/;
      }>();

    return {
      blaze: data.blaze,
      usdc: data.usdc,
      usdt: data.usdt,
    };
  },
  name: "walletBalance",
});
