import { createContext, useContext, useState } from "react";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState(null);

  const updateProduct = (newProduct) => {
    setProduct(newProduct);
  };

  return (
    <ProductContext.Provider value={{ product, updateProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  return useContext(ProductContext);
};
