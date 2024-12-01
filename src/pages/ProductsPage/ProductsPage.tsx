import React, { useState } from "react";
import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useFetch } from "../../hooks/useFetch";
import { CategorySection } from "./CategorySection";
import { Skeleton } from "@mui/material";
import { ProductSearch } from "./ProductSearch";
import { useTranslation } from "react-i18next";
import { PoweredBy } from "../../components/PoweredBy/PoweredBy";
import { HiddenUI } from "../../types/widget";
import { useWidgetConfig } from "../../providers/WidgetProvider/WidgetProvider";
import { CategoryPage } from "./CategoryPage/CategoryPage";

export const ProductsPage = () => {
  const { hiddenUI } = useWidgetConfig();
  const { error, isPending, data } = useFetch({
    url: "products/grouped/",
  });
  const { t } = useTranslation();
  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useHeader(t("header.spend"));

  const handleMoreClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  if (selectedCategory) {
    return (
      <PageContainer>
        <CategoryPage category={selectedCategory} onBack={handleBack} />
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
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  );
};
