import { Variant } from "../stores/ProductProvider/types";

export const getUniqueSubTypes = (variants: Variant[]): string[] => {
  return Array.from(
    new Set(variants.flatMap((variant) => variant.subTypes))
  ).filter((subType): subType is string => typeof subType === "string");
};

export const filterVariantsBySubType = (
  variants: Variant[],
  subType: string
): Variant[] => {
  return subType
    ? variants.filter((variant) => variant.subTypes.includes(subType))
    : variants;
};

export const sortVariantsByPrice = (variants: Variant[]): Variant[] => {
  return variants.sort(
    (a, b) => parseFloat(a.price.fiatValue) - parseFloat(b.price.fiatValue)
  );
};

export const findVariantIndex = (
  variants: Variant[],
  variantId: string
): number => {
  return variants.findIndex((v) => v.id === variantId);
};

export const formatPrice = (price: string): string => {
  return parseFloat(price).toFixed(2).toString();
};
