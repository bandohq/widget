import { Brand } from "../providers/CatalogProvider/types";
import { Variant } from "../stores/ProductProvider/types";

/**
 * Verify if a brand matches the selected categories
 */
export const brandMatchesCategories = (
  brand: Brand,
  selected: Set<string>
): boolean => {
  if (selected.size === 0) return true;

  return brand.variants?.some((v: Variant) =>
    (v.categories ?? []).some((c) => selected.has(c.toLowerCase()))
  );
};
