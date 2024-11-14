import { PageContainer } from "../../../components/PageContainer";
import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { ProductsGrid } from "../ProductPage.style";
import { ImageAvatar } from "../../../components/Avatar/Avatar";
import { ProductSearch } from "../ProductSearch";
import { useHeader } from "../../../hooks/useHeader";
import { useCountryContext } from "../../../stores/CountriesProvider/CountriesProvider";

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const { country } = useCountryContext();

  const { data, error, isPending } = useFetch<any[]>({
    url: "products",
    queryParams: {
      type: categoryName,
      pageNumber: page,
      pageSize: 100,
      country: country.iso_alpha2,
    },
    queryOptions: { keepPreviousData: true },
  });
  const { products, currentPage } = data || {};
  useHeader(categoryName);

  useEffect(() => {
    if (products) {
      setAllProducts((prev) => {
        const existingIds = new Set(prev.map((product) => product.id));
        const newProducts = products.filter(
          (product) => !existingIds.has(product.id)
        );
        return [...prev, ...newProducts];
      });
    }
  }, [currentPage]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isPending || !lastProductRef.current) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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
  }, [isPending]);

  return (
    <PageContainer>
      <ProductSearch />
      <ProductsGrid>
        {allProducts.map((product, index) => {
          const isLast = index === allProducts.length - 1;
          return (
            <div ref={isLast ? lastProductRef : null} key={product.id}>
              <ImageAvatar
                name={product.brand}
                src={product.img_url}
                sx={{ width: "100%", height: "100%" }}
              />
            </div>
          );
        })}
      </ProductsGrid>

      <Button
        variant="outlined"
        disabled={isPending}
        onClick={() => setPage((prev) => prev + 1)}
      >
        Load more
      </Button>

      {isPending && <CircularProgress />}
    </PageContainer>
  );
};
