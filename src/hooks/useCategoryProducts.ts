import { useEffect, useState, useRef, useCallback } from "react";
import { useCountryContext } from "../stores/CountriesProvider/CountriesProvider";
import { debounce } from "lodash";
import { useGroupedProducts } from "./useGroupedProducts";
import { useCatalogContext } from "../providers/CatalogProvider/CatalogProvider";

export const useCategoryProducts = (categoryName?: string) => {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const { products, isLoading, error: productsError, searchQuery, setSearchQuery } = useCatalogContext();

  useEffect(() => {
    if (isLoading) {
      setPage(1);
      setAllProducts([]);
    }
  }, [isLoading]);

  useEffect(() => {
    if (products) {
      setAllProducts((prevProducts) => [...prevProducts, ...products]);
    }
    if (productsError) {
      setError(productsError);
    }
  }, [products, productsError]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoading || !lastProductRef.current) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          data?.currentPage < data?.totalPages
        ) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    if (lastProductRef.current) {
      observer.current.observe(lastProductRef.current);
    }

    return () => observer.current?.disconnect();
  }, [isProductsPending, data]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setPage(1);
      setAllProducts([]);
    }, 500),
    []
  );

  return {
    allProducts,
    isProductsPending,
    currentPage: data?.currentPage,
    totalPages: data?.totalPages,
    lastProductRef,
    setPage,
    debouncedSearch,
    error,
  };
};
