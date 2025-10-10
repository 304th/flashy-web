import { BlazeIcon } from "@/components/ui/icons/blaze";
import { UsdcIcon } from "@/components/ui/icons/usdc";
import { UsdtIcon } from "@/components/ui/icons/usdt";

export const WalletTokenIcon = ({ token }: { token: WalletToken }) => {
  switch (token) {
    case "blaze":
      return <BlazeIcon />;
    case "usdc":
      return <UsdcIcon />;
    case "usdt":
      return <UsdtIcon />;
  }
};
