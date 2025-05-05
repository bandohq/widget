import { Variant } from "../stores/ProductProvider/types";

export const getClosestVariantIndex = (
  variants: Variant[],
  targetValue: number
): number => {
  let closestIndex = 0;
  let closestDiff = Infinity;

  if (!variants || variants.length === 0) {
    return -1;
  }

  variants.forEach((variant, index) => {
    const currentValue = parseFloat(variant.price.fiatValue);
    const currentDiff = Math.abs(currentValue - targetValue);
    if (currentDiff < closestDiff) {
      closestDiff = currentDiff;
      closestIndex = index;
    }
  });

  return closestIndex;
};
