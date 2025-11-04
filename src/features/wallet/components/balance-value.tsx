import { useMemo } from "react";
import {formatBalance, formatTokenAmount} from "@/features/wallet/utils/format-balance";

export const BalanceValue = ({
  balance,
  prefix,
  className,
}: {
  balance: string;
  prefix?: string;
  className?: string;
}) => {
  const formattedBalance = useMemo(() => formatTokenAmount(balance, {
    smallDecimals: 2,
  }), [balance]);

  const [wholePart, fractionalPart] = useMemo(
    () => formattedBalance.split("."),
    [formattedBalance],
  );

  return (
    <p className={`text-white ${className}`}>
      {prefix}
      {wholePart}.
      {fractionalPart.split("").map((digit, index) => (
        <span
          key={`fraction-${digit}-${index}`}
          style={{ opacity: 1 - (index + 1) / 6 }}
        >
          {digit}
        </span>
      ))}
    </p>
  );
};
