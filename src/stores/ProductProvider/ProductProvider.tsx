import { createContext, useContext, useState } from "react";
import { Product } from "./types";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState<Product>(null);
  const [brand, setBrand] = useState(null);

  const updateProduct = (newProduct) => {
    setProduct(newProduct);
  };

  const updateBrand = (newBrand) => {
    setBrand(newBrand);
  };

  return (
    <ProductContext.Provider
      value={{ product, brand, updateProduct, updateBrand }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  return useContext(ProductContext);
};
