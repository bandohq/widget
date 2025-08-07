import { Variant } from "../stores/ProductProvider/types";

export const getUniqueSubTypes = (variants: Variant[]): string[] => {
  const normalizedVariants = variants.map((variant) => {
    // if subTypes is undefined, null or an empty array, replace it with ["topup"]
    if (
      !variant.subTypes ||
      variant.subTypes.length === 0 ||
      variant.subTypes.every((subType) => !subType || subType.trim() === "")
    ) {
      return { ...variant, subTypes: ["Topup"] };
    }
    return variant;
  });

  const subTypes = Array.from(
    new Set(normalizedVariants.flatMap((variant) => variant.subTypes || []))
  );

  // Filtrar y limpiar
  return subTypes
    .filter((subType): subType is string => typeof subType === "string")
    .map((subType) => (subType.trim() === "" ? "Topup" : subType));
};

export const filterVariantsBySubType = (
  variants: Variant[],
  subType: string
): Variant[] => {
  return variants.filter((variant) => {
    const normalizedSubTypes =
      !variant.subTypes ||
      variant.subTypes.length === 0 ||
      variant.subTypes.every((sub) => !sub || sub.trim() === "")
        ? ["Topup"]
        : variant.subTypes;

    if (subType === "Topup") {
      return normalizedSubTypes.includes("Topup");
    }

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