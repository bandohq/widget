import React, { useState, useEffect } from "react";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useFetch } from "../../hooks/useFetch";
import { CategorySection } from "./CategorySection";
import { Skeleton } from "@mui/material";
import { ProductSearch } from "./ProductSearch";
import { useTranslation } from "react-i18next";
import { CategoryPage } from "./CategoryPage/CategoryPage";
import { useNavigate } from "react-router-dom";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { useCountryContext } from "../../stores/CountriesProvider/CountriesProvider";
import { useCategoryProducts } from "../../hooks/useCategoryProducts";
import { useCatalogContext } from "../../providers/CatalogProvider/CatalogProvider";

export const ProductsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filteredData, setFilteredData] = useState(null);
  const { products, isLoading, setSearchQuery } = useCatalogContext();

  useHeader(t("header.spend"));

  useEffect(() => {
    if (!isLoading && products) {
      setFilteredData(products);
    }
  }, [products, isLoading]);

  const handleMoreClick = (category) => {
    navigate(`${navigationRoutes.products}/${category.productType}`);
  };

  return (
    <div>
      <ProductSearch onSearchChange={setSearchQuery} />

      {isLoading
        ? Array.from(new Array(5)).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height="50px"
              sx={{ marginBottom: 1 }}
            />
          ))
        : filteredData?.map((category) => (
            <CategorySection
              key={category.productType}
              category={category}
              onMoreClick={() => handleMoreClick(category)}
            />
          ))}
    </div>
  );
};
