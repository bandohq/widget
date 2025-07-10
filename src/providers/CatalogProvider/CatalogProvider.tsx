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
  fuzzySearchBrands: (searchTerm: string, productType?: string) => void;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const {
    selectedCountry: country,
    isCountryPending,
    error: countryError,
    hasCountries,
  } = useCountryContext();
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
    url: "products/grouped/",
    queryParams: {
      country: !!country ? country?.isoAlpha2 : null,
    },
    enabled: !!country && !isCountryPending && hasCountries && !countryError,
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
  }, [buildUrl, products, updateProduct, updateBrand, navigate]);

  const fuzzySearchBrands = (searchTerm: string, productType?: string) => {
    if (!products.length) return;

    const fuse = new Fuse(products, {
      keys: ["brands.name", "brands.description"],
      threshold: 0.3,
    });

    let searchResults = products;

    if (searchTerm) {
      const results = fuse.search(searchTerm);
      searchResults = results.map((result) => result.item);
    }

    let filteredProducts = searchResults;

    if (productType) {
      filteredProducts = searchResults.filter(
        (product) => product.productType === productType
      );
    }

    const allBrands = filteredProducts.flatMap((product) => product.brands);
    setFilteredBrands(allBrands);
  };

  return (
    <CatalogContext.Provider
      value={{
        products,
        filteredBrands,
        isLoading: isPending || isCountryPending,
        error: error || countryError,
        fuzzySearchBrands,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => {
  const context = useContext(CatalogContext);
  if (context === undefined) {
    throw new Error("useCatalogContext must be used within a CatalogProvider");
  }
  return context;
};
