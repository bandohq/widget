import { createContext, useContext, useState } from "react";
import { Variant } from "./types";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const { buildUrl } = useWidgetConfig();
  const [product, setProduct] = useState<Variant>(null);
  const [brand, setBrand] = useState(null);

  const updateUrlProduct = (variantId: string | null) => {
    if (buildUrl) {
      const searchParams = new URLSearchParams(window.location.search);
      if (variantId) {
        searchParams.set("product", variantId);
      } else {
        searchParams.delete("product");
      }
      window.history.replaceState(null, "", `?${searchParams.toString()}`);
    }
  };

  const updateProduct = (newProduct) => {
    setProduct(newProduct);
    updateUrlProduct(newProduct ? newProduct.id : null);
  };

  const updateBrand = (newBrand) => {
    setBrand(newBrand);
  };

  const resetProduct = () => {
    setProduct(null);
    setBrand(null);
    updateUrlProduct(null);
  };

  return (
    <ProductContext.Provider
      value={{ product, brand, updateProduct, updateBrand, resetProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  return useContext(ProductContext);
};
