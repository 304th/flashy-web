export const formatBalance = (balance: string) => {
  const number = parseFloat(balance);

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  }).format(number);
};

export const subscript = (num: number): string => {
  const map = {
    0: "₀",
    1: "₁",
    2: "₂",
    3: "₃",
    4: "₄",
    5: "₅",
    6: "₆",
    7: "₇",
    8: "₈",
    9: "₉",
  } as Record<number, string>;

  return num
    .toString()
    .split("")
    .map((digit) => map[+digit] || "")
    .join("");
};

export const formatTokenAmount = (
  priceStr: string,
  format: {
    subscriptDecimals?: number;
    largeDecimals?: number;
    smallDecimals?: number;
  } = {},
) => {
  const subscriptDecimals = format.subscriptDecimals ?? 2;
  const largeDecimals = format.largeDecimals ?? 2;
  const smallDecimals = format.smallDecimals ?? 4;

  const trimmed = priceStr.trim();
  const isNegative = trimmed.startsWith("-");
  const absStr = isNegative ? trimmed.slice(1) : trimmed;
  const [intPart = "0", decPart = ""] = absStr.split(".");

  if (parseInt(intPart, 10) >= 1) {
    const num = parseFloat(intPart + "." + decPart);
    const formatted = num.toFixed(largeDecimals);

    return isNegative ? "-" + formatted : formatted;
  }

  const firstNonZero = decPart.search(/[^0]/);

  if (firstNonZero === -1) {
    const decimals = "0".repeat(smallDecimals);

    return isNegative ? `-0.${decimals}` : `0.${decimals}`;
  }

  const leadingZeros = firstNonZero;
  const sigStr = BigInt(decPart.slice(firstNonZero)).toString();

  let result = "0.";
  let slotsUsed: number;

  if (leadingZeros > subscriptDecimals) {
    result += "0" + subscript(leadingZeros);
    slotsUsed = 1;
  } else {
    const zeros = Math.min(leadingZeros, smallDecimals);
    result += "0".repeat(zeros);
    slotsUsed = zeros;
  }

  const digitsLeft = smallDecimals - slotsUsed;
  const digits = sigStr.slice(0, digitsLeft).padEnd(digitsLeft, "0");
  result += digits;

  return isNegative ? "-" + result : result;
};
