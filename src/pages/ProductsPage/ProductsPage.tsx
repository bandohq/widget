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

export const ProductsPage = () => {
  const navigate = useNavigate();
  const { error, isPending, data } = useFetch({
    url: "products/grouped/",
  });
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  useHeader(t("header.spend"));

  const handleMoreClick = (category) => {
    setSelectedCategory(category);
    navigate(`${navigationRoutes.products}/${category.productType}`);
  };

  if (selectedCategory) {
    return (
      <PageContainer>
        <CategoryPage />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ProductSearch />

      {isPending
        ? Array.from(new Array(5)).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height="100px"
            />
          ))
        : data?.products?.map((category) => (
            <CategorySection
              key={category.productType}
              category={category}
              onMoreClick={handleMoreClick}
            />
          ))}
    </PageContainer>
  );
};
