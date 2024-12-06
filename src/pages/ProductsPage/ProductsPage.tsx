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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  useHeader(t("header.spend"));

  useEffect(() => {
    console.log(data);
    setFilteredData(data);
  }, [data]);

  const handleMoreClick = (category) => {
    setSelectedCategory(category);
    navigate(`${navigationRoutes.products}/${category.productType}`);
  };

  const handleSearchChange = (query) => {  
    // Use original data for searching
    const fData = data?.products
      ?.map((category) => {
        // Filter brands within each category
        const matchingBrands = category.brands.filter((item) =>
          item.brandSlug.toLowerCase().includes(query.toLowerCase())
        );
  
        // Return the category with the filtered brands
        return {
          ...category,
          brands: matchingBrands,
        };
      })
      // Filter out categories with no matching brands
      ?.filter((category) => category.brands.length > 0);
    setSearchQuery(query);
  
    // Update filteredData with the new filtered products
    setFilteredData({ products: fData });
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
      <ProductSearch onSearchChange={handleSearchChange} />

      {isPending
        ? Array.from(new Array(5)).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height="100px"
            />
          ))
        : filteredData?.products?.map((category) => (
            <CategorySection
              key={category.productType}
              category={category}
              onMoreClick={handleMoreClick}
            />
          ))}
    </PageContainer>
  );
};
