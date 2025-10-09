export const formatBalance = (balance: string) => {
  const number = parseFloat(balance);

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5
  }).format(number);
}