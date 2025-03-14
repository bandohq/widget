export const roundUpAmount = (amount: number, decimals = 4) => {
  const factor = 10 ** decimals;
  return Math.ceil(amount * factor) / factor;
};
