import { PageContainer } from "../../components/PageContainer";
import { useHeader } from "../../hooks/useHeader";
import { useFetch } from "../../hooks/useFetch";
import { CategorySection } from "./CategorySection";

export const ProductsPage = () => {
  const { error, isPending } = useFetch({
    url: "https://api.example.com/products",
  });

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

  useHeader("Products");

  return (
    <PageContainer>
      {categories.map((category) => (
        <CategorySection key={category.id} category={category} />
      ))}
    </PageContainer>
  );
};
