import { env } from "@/config";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loadable } from "@/components/ui/loadable";
import { BalanceValue } from "@/features/wallet/components/balance-value";
import { Button } from "@/components/ui/button";
import { WalletTokenIcon } from "@/features/wallet/components/wallet-token-icon/wallet-token-icon";
import { useWalletBalance } from "@/features/wallet/queries/use-wallet-balance";
import { usePathnameChangedEffect } from "@/hooks/use-pathname-changed-effect";
import { Spinner } from "@/components/ui/spinner/spinner";

export const BalanceButton = () => {
  const { data: balance, query } = useWalletBalance();
  const [open, setOpen] = useState(false);
  const [balanceToken, setBalanceToken] = useState<WalletToken>(() =>
    env.IS_BROWSER
      ? (localStorage.getItem("balanceToken") as WalletToken) || "blaze"
      : "blaze",
  );

  usePathnameChangedEffect(() => {
    setOpen(false);
  });

  useEffect(() => {
    localStorage.setItem("balanceToken", balanceToken);
  }, [balanceToken]);

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      {open && <div className="absolute w-full h-8 right-0 bottom-[-8px]" />}
      <DropdownMenu modal={false} open={open}>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            onMouseEnter={() => setOpen(true)}
          >
            <Loadable queries={[query]} defaultFallbackClassname="p-2">
              {() => (
                <BalanceValue balance={balance?.[balanceToken] || "0.0"} />
              )}
            </Loadable>
            <div className="scale-150">
              <WalletTokenIcon token={balanceToken} />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-full min-w-[200px] bg-base-300 border-base-400 gap-1"
          align="end"
        >
          <div className="p-1">
            <p className="text-base-800">Wallet Balance:</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="flex flex-col gap-1">
            <DropdownMenuItem
              className={`transition items-center justify-between
                ${balanceToken === "blaze" ? "bg-base-400" : ""}`}
              onClick={() => {
                setBalanceToken("blaze");
                setOpen(false);
              }}
            >
              <div className="scale-150">
                <WalletTokenIcon token="blaze" />
              </div>
              <BalanceValue balance={balance?.blaze || "0.0"} />
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`transition items-center justify-between
                ${balanceToken === "usdc" ? "bg-base-400" : ""}`}
              onClick={() => {
                setBalanceToken("usdc");
                setOpen(false);
              }}
            >
              <div className="scale-150">
                <WalletTokenIcon token="usdc" />
              </div>
              <BalanceValue balance={balance?.usdc || "0.0"} />
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`transition items-center justify-between
                ${balanceToken === "usdt" ? "bg-base-400" : ""}`}
              onClick={() => {
                setBalanceToken("usdt");
                setOpen(false);
              }}
            >
              <div className="scale-150">
                <WalletTokenIcon token="usdt" />
              </div>
              <BalanceValue balance={balance?.usdt || "0.0"} />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="absolute w-[80px] h-6 right-0" />
    </div>
  );
};
