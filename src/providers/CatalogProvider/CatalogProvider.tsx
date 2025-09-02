import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider";
import { useFetch } from "../../hooks/useFetch";
import Fuse from "fuse.js";
import { Product, ProductQueryResult, Brand } from "./types";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useWidgetConfig } from "../WidgetProvider/WidgetProvider";
import { useNavigate } from "react-router-dom";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { brandMatchesCategories } from "../../utils/catalogUtils";

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
  const { buildUrl, categories: selectedCategories } = useWidgetConfig();

  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);

  const {
    data: groupedCatalogResponse,
    isPending,
    error,
  } = useFetch<ProductQueryResult>({
    method: "GET",
    url: "products/grouped/",
    queryParams: { country: !!country ? country?.isoAlpha2 : null },
    enabled: !!country && !isCountryPending,
    queryOptions: {
      queryKey: ["products", country?.isoAlpha2],
      retry: true,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    },
  });

  useEffect(() => {
    if (groupedCatalogResponse?.products) {
      const normalized = groupedCatalogResponse.products.map((p) => ({
        ...p,
        brands: p.brands ?? [],
      }));
      setRawProducts(normalized);
    }
  }, [groupedCatalogResponse]);

  useEffect(() => {
    const selected = new Set(
      (selectedCategories ?? []).map((s) => s.trim().toLowerCase())
    );

    const filtered = rawProducts.map((p) => {
      const brands = (p.brands || []).filter((b) =>
        brandMatchesCategories(b, selected)
      );
      return { ...p, brands };
    });

    const result = selected.size === 0 ? rawProducts : filtered;
    setProducts(result);
    setFilteredBrands([]);
  }, [rawProducts, selectedCategories]);

  useEffect(() => {
    if (!buildUrl) return;

    const searchParams = new URLSearchParams(window.location.search);
    const urlProduct = searchParams.get("product");
    if (!urlProduct) return;

    let foundVariant = null;
    let foundBrand = null;

    outer: for (const product of rawProducts) {
      for (const brand of product.brands) {
        const variant = brand.variants.find((v) => v.sku === urlProduct);
        if (variant) {
          foundVariant = variant;
          foundBrand = brand;
          break outer;
        }
      }
    }

    if (foundVariant && foundBrand) {
      updateProduct(foundVariant);
      updateBrand(foundBrand);
      navigate(navigationRoutes.form);
    }
  }, [buildUrl, rawProducts]);

  const fuzzySearchBrands = useCallback(
    (searchTerm: string, productType?: string) => {
      const term = searchTerm?.trim() ?? "";

      if (!term) {
        setFilteredBrands([]);
        return;
      }

      const baseProducts = productType
        ? products.filter((product) => product.productType === productType)
        : products;

      const brandsPool = baseProducts.flatMap(
        (product) => product.brands ?? []
      );

      const fuse = new Fuse(brandsPool, {
        keys: ["brandName"],
        threshold: 0.3,
      });

      const results = fuse.search(term);
      setFilteredBrands(results.map((r) => r.item));
    },
    [products]
  );

  const value = {
    products,
    filteredBrands,
    isLoading: isPending,
    error,
    hasProducts: products.some((p) => (p.brands?.length ?? 0) > 0),
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
