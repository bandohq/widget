import { useState, useEffect } from "react";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { CategorySection } from "./CategorySection";
import { Skeleton, Box, Typography } from "@mui/material";
import { ProductSearch } from "./ProductSearch";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { useCatalogContext } from "../../providers/CatalogProvider/CatalogProvider";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider";
import { BrandsContainer } from "./ProductPage.style";
import { ProductList } from "../../components/ProductList/ProductList";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { RecentSpends } from "../../components/RecentSpends/RecentSpends";
import { useFieldActions } from "../../stores/form/useFieldActions";
import { CountriesError } from "../../components/CountriesError/CountriesError";

export const ProductsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filteredData, setFilteredData] = useState(null);
  const {
    products,
    isLoading,
    filteredBrands,
    fuzzySearchBrands,
    error: catalogError,
  } = useCatalogContext();
  const { error: countryError, retryFetch } = useCountryContext();
  const { updateProduct } = useProduct();
  const { setFieldValue } = useFieldActions();

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

  // Show country error if there's an error with countries
  if (countryError) {
    return (
      <PageContainer>
        <CountriesError
          error={countryError}
          onRetry={retryFetch}
          variant="fullPage"
        />
      </PageContainer>
    );
  }

  // Show catalog error if there's an error with the catalog
  if (catalogError) {
    return (
      <PageContainer>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            py: 4,
            px: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t("error.title.unknown")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("error.message.unknown")}
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ProductSearch productType="" />
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
