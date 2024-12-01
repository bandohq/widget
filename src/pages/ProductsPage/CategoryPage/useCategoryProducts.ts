import { useEffect, useState, useRef, useCallback } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { useCountryContext } from "../../../stores/CountriesProvider/CountriesProvider";
import { debounce } from "lodash";

export const useCategoryProducts = (categoryName: string) => {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { country } = useCountryContext();

  const { data, error, isPending } = useFetch<any[]>(
    {
      url: "products",
      queryParams: {
        type: categoryName,
        pageNumber: page,
        pageSize: 100,
        country: country.iso_alpha2,
        brand: searchQuery,
      },
    },
  );

  const { products, currentPage, totalPages } = data || {};

  useEffect(() => {
    setAllProducts([]); // Clear the products array
    setPage(1);
    if (data && data.products !== undefined) {
      setAllProducts(data.products);
    }
  }, [data, country, searchQuery, categoryName]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isPending || !lastProductRef.current) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
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
  }, [isPending, currentPage, totalPages]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  return {
    allProducts,
    isPending,
    currentPage,
    totalPages,
    lastProductRef,
    setPage,
    debouncedSearch,
    error,
  };
};
