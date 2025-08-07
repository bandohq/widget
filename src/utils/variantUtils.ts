import { Variant } from "../stores/ProductProvider/types";

// Helper function to normalize subTypes
const normalizeSubTypes = (subTypes: string[] | undefined): string[] => {
  if (
    !subTypes ||
    subTypes.length === 0 ||
    subTypes.every((subType) => !subType || subType.trim() === "")
  ) {
    return ["Topup"];
  }
  return subTypes;
};

export const getUniqueSubTypes = (variants: Variant[]): string[] => {
  const subTypes = Array.from(
    new Set(variants.flatMap((variant) => normalizeSubTypes(variant.subTypes)))
  );

  // filter and clean
  return subTypes
    .filter((subType): subType is string => typeof subType === "string")
    .map((subType) => (subType.trim() === "" ? "Topup" : subType));
};

export const filterVariantsBySubType = (
  variants: Variant[],
  subType: string
): Variant[] => {
  return variants.filter((variant) => {
    const normalizedSubTypes = normalizeSubTypes(variant.subTypes);
    return normalizedSubTypes.includes(subType);
  });
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
  const parsedPrice = parseFloat(price);
  return !isNaN(parsedPrice) ? parsedPrice.toFixed(2).toString() : "0.00";
};