import React, { createContext, useContext, useState, useEffect } from "react";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider";
import { useFetch } from "../../hooks/useFetch";
import Fuse from "fuse.js";
import { Product, ProductQueryResult, Brand } from "./types";

interface CatalogContextType {
  products: Product[];
  filteredBrands: Brand[];
  isLoading: boolean;
  error: any;
  fuzzySearchBrands: (searchTerm: string, productType?: string) => void;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { selectedCountry: country, isCountryPending } = useCountryContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);

  const {
    data: groupedCatalogResponse,
    isPending,
    error,
  } = useFetch<ProductQueryResult>({
    url: "products/grouped/",
    queryParams: {
      country: !!country ? country?.iso_alpha2 : null,
    },
    enabled: !!country && !isCountryPending,
  });

  useEffect(() => {
    if (groupedCatalogResponse?.products) {
      const p = groupedCatalogResponse?.products || [];
      setProducts(p);
    }
  }, [groupedCatalogResponse]);

  const fuzzySearchBrands = (searchTerm: string, productType?: string) => {
    const filteredProducts = productType
      ? products.filter((product) => product.productType === productType)
      : products;

    const allBrands = filteredProducts.flatMap((product) => product.brands);

    if (!searchTerm.trim() && productType) {
      // if the search term is empty, show all brands for the selected category
      setFilteredBrands(allBrands);
      return;
    }

    const fuse = new Fuse(allBrands, {
      keys: ["brandName"],
      threshold: 0.3,
    });

    const results = fuse.search(searchTerm);
    setFilteredBrands(results.map((result) => result.item));
  };

  const value = {
    products,
    filteredBrands,
    isLoading: isPending,
    error,
    fuzzySearchBrands,
  };

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
};

export const useCatalogContext = () => {
  const context = useContext(CatalogContext);
  if (context === undefined) {
    throw new Error("useCatalogContext must be used within a CatalogProvider");
  }
  return context;
};
