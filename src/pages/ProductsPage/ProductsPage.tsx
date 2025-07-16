import { useState, useEffect, useMemo } from "react";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { CategorySection } from "./CategorySection";
import { Skeleton, Box } from "@mui/material";
import { ProductSearch } from "./ProductSearch";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { useCatalogContext } from "../../providers/CatalogProvider/CatalogProvider";
import { BrandsContainer } from "./ProductPage.style";
import { ProductList } from "../../components/ProductList/ProductList";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { RecentSpends } from "../../components/RecentSpends/RecentSpends";
import { useFieldActions } from "../../stores/form/useFieldActions";
import { useIsWorld } from "../../hooks/useIsWorld";

export const ProductsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filteredData, setFilteredData] = useState(null);
  const { products, isLoading, filteredBrands, fuzzySearchBrands } =
    useCatalogContext();
  const { updateProduct } = useProduct();
  const { setFieldValue } = useFieldActions();
  const isWorld = useIsWorld();

  useHeader(t("header.spend"));

  useEffect(() => {
    setFieldValue("reference", "");
  }, []);

  useEffect(() => {
    if (!isLoading && products) {
      const reducedProducts = products.map((category) => {
        return {
          ...category,
          brands: [...category.brands.slice(0, 10)],
          showMore: category.brands.length > 10,
        };
      });

      setFilteredData(reducedProducts);
    }
  }, [products, isLoading]);

  useEffect(() => {
    fuzzySearchBrands("");
  }, []);

  const handleMoreClick = (category) => {
    navigate(`${navigationRoutes.products}/${category.productType}`);
  };

  const handleSelectVariant = (variant) => {
    updateProduct(variant);
    navigate(`/form`);
  };

  return (
    <PageContainer>
      {isWorld && <p>Worldcoin</p>}
      <ProductSearch />
      <RecentSpends />
      {filteredBrands.length > 0 && (
        <ProductList
          brands={filteredBrands}
          onSelectVariant={handleSelectVariant}
          isDropdown
        />
      )}
      {isLoading
        ? Array.from(new Array(2)).map((_, index) => (
            <Box key={index} sx={{ marginBottom: 4 }}>
              <Skeleton
                variant="rectangular"
                width="20%"
                height="20px"
                sx={{ marginBottom: 1, mt: 2 }}
              />
              <BrandsContainer>
                {Array.from(new Array(10)).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{ marginBottom: 1, borderRadius: "5px" }}
                  />
                ))}
              </BrandsContainer>
            </Box>
          ))
        : filteredBrands.length == 0 && (
            <div style={{ overflow: "hidden" }}>
              {filteredData?.map((category) => (
                <Box
                  key={category.productType}
                  sx={{
                    marginBottom: "30px",
                    marginTop: "20px",
                  }}
                >
                  <CategorySection
                    category={category}
                    onMoreClick={() => handleMoreClick(category)}
                  />
                </Box>
              ))}
            </div>
          )}
    </PageContainer>
  );
};
