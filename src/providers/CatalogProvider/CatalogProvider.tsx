import React, { createContext, useContext, useState, useEffect } from "react";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider";
import { useFetch } from "../../hooks/useFetch";
import Fuse from "fuse.js";
import { Product, ProductQueryResult, Brand } from "./types";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useWidgetConfig } from "../WidgetProvider/WidgetProvider";
import { useNavigate } from "react-router-dom";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { Variant } from "../../stores/ProductProvider/types";

interface CatalogContextType {
  products: Product[];
  filteredBrands: Brand[];
  isLoading: boolean;
  error: any;
  hasProducts: boolean;
  fuzzySearchBrands: (searchTerm: string, productType?: string) => void;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { selectedCountry: country, isCountryPending } = useCountryContext();
  const { updateProduct, updateBrand } = useProduct();
  const { buildUrl } = useWidgetConfig();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);

  const {
    data: groupedCatalogResponse,
    isPending,
    error,
  } = useFetch<ProductQueryResult>({
    method: "GET",
    url: "product/grouped/",
    queryParams: {
      country: !!country ? country?.isoAlpha2 : null,
    },
    enabled: !!country && !isCountryPending,
  });

  useEffect(() => {
    if (groupedCatalogResponse?.products) {
      const p = groupedCatalogResponse?.products || [];
      setProducts(p);
    }
  }, [groupedCatalogResponse]);

  useEffect(() => {
    if (buildUrl) {
      const searchParams = new URLSearchParams(window.location.search);
      const urlProduct = searchParams.get("product"); // variant SKU

      if (urlProduct) {
        let foundVariant: Variant | null = null;
        let foundBrand: Brand | null = null;

        for (const product of products) {
          for (const brand of product.brands) {
            const variant = brand.variants.find((v) => v.sku === urlProduct);
            if (variant) {
              foundVariant = variant;
              foundBrand = brand;
              break;
            }
          }
          if (foundVariant) break;
        }

        if (foundVariant && foundBrand) {
          updateProduct(foundVariant);
          updateBrand(foundBrand);
          navigate(navigationRoutes.form);
        }
      }
    }
  }, [buildUrl, products]);

  const fuzzySearchBrands = (searchTerm: string, productType?: string) => {
    const filteredProducts = productType
      ? products.filter((product) => product.productType === productType)
      : products;

    const allBrands = filteredProducts.flatMap((product) => product.brands);

    if (!searchTerm.trim() && productType) {
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
    hasProducts: products.length > 0,
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
