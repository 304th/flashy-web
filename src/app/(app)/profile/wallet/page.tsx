"use client";

import { WalletValue } from "@/features/wallet/components/wallet-value";
import { TokenList } from "@/features/wallet/components/token-list/token-list";
import { BoughtKeysDetailsList } from "@/features/keys/components/bought-keys-details-list/bought-keys-details-list";

export default function ProfileSocialPage() {
  return (
    <div className="flex flex-col gap-8 w-full pb-10">
      <WalletValue />
      <TokenList />
      <BoughtKeysDetailsList />
    </div>
  );
}
