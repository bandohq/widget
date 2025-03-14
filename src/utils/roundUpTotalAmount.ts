export const roundUpAmount = (amount, decimals = 4) => {
  const factor = 10 ** decimals;
  return Math.ceil(amount * factor) / factor;
};
