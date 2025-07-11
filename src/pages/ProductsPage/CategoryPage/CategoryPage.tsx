import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductSearch } from "../ProductSearch";
import { PageContainer } from "../../../components/PageContainer";
import { useHeader } from "../../../hooks/useHeader";
import { useCatalogContext } from "../../../providers/CatalogProvider/CatalogProvider";
import { useProduct } from "../../../stores/ProductProvider/ProductProvider";
import { ProductList } from "../../../components/ProductList/ProductList";
import { useTranslation } from "react-i18next";
import { Box, Skeleton } from "@mui/material";

export const CategoryPage = () => {
  const { category } = useParams(); // productType
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { products, filteredBrands, fuzzySearchBrands, isLoading, error } =
    useCatalogContext();
  const { updateProduct } = useProduct();

  useEffect(() => {
    if (!isLoading && category) {
      const categoryProducts = products.filter(
        (product) => product.productType === category
      );

      if (categoryProducts.length === 0) {
        navigate(`/form`);
      } else {
        fuzzySearchBrands("", category);
      }
    }
  }, [products, category, isLoading]);

  const handleSelectVariant = (variant) => {
    updateProduct(variant);
    navigate(`/form`);
  };

  useHeader(t(`main.${category}`));

  return (
    <PageContainer>
      {!isLoading && (
        <div
          style={{
            height: "550px",
            overflow: "auto",
            paddingBottom: "10px",
            scrollbarWidth: "none",
          }}
        >
          <ProductSearch productType={category} />
          <ProductList
            brands={filteredBrands}
            onSelectVariant={handleSelectVariant}
          />
        </div>
      )}
      {isLoading && (
        <div>
          <ProductSearch productType={category} disabled={error} />
          <Box sx={{ padding: 2 }}>
            {Array.from(new Array(5)).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height="80px"
                sx={{ marginBottom: 2, borderRadius: "8px" }}
              />
            ))}
          </Box>
        </div>
      )}
    </PageContainer>
  );
};
