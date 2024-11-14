import { useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { ProductsGrid } from "../ProductPage.style";
import { ImageAvatar } from "../../../components/Avatar/Avatar";
import { ProductSearch } from "../ProductSearch";
import { useHeader } from "../../../hooks/useHeader";
import { PageContainer } from "../../../components/PageContainer";
import { useCategoryProducts } from "./useCategoryProducts";

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const {
    allProducts,
    isPending,
    currentPage,
    totalPages,
    lastProductRef,
    setPage,
    debouncedSearch,
  } = useCategoryProducts(categoryName);

  useHeader(categoryName);

  return (
    <PageContainer>
      <ProductSearch onSearchChange={debouncedSearch} />
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

      {currentPage < totalPages && !isPending && (
        <Button
          variant="contained"
          fullWidth
          onClick={() => setPage((prev) => prev + 1)}
        >
          Load more
        </Button>
      )}

      {isPending && <CircularProgress sx={{ margin: "auto" }} />}
    </PageContainer>
  );
};
