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

export const ProductsPage = () => {
  const { hiddenUI } = useWidgetConfig();
  const { error, isPending } = useFetch({
    url: "products",
  });
  const { t } = useTranslation();
  const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy);

  const categories = [
    {
      id: 1,
      name: "Electronics",
      products: [
        { id: 1, name: "Laptop", img_url: null },
        { id: 2, name: "PCerda", img_url: null },
        { id: 1, name: "mouse", img_url: null },
        { id: 1, name: "amazon Card", img_url: null },
        { id: 1, name: "Steam Card", img_url: null },
        { id: 1, name: "", img_url: null },
      ],
    },
  ];

  useHeader(t("header.products"));

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
        : categories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
      {showPoweredBy ? <PoweredBy /> : null}
    </PageContainer>
  );
};
