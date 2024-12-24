import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductSearch } from "../ProductSearch";
import { PageContainer } from "../../../components/PageContainer";
import { useHeader } from "../../../hooks/useHeader";
import { useCatalogContext } from "../../../providers/CatalogProvider/CatalogProvider";
import { useProduct } from "../../../stores/ProductProvider/ProductProvider";
import { ProductList } from "../../../components/ProductList/ProductList";

export const CategoryPage = () => {
  const { category } = useParams(); // productType
  const navigate = useNavigate();
  const { products, filteredBrands, fuzzySearchBrands, isLoading } =
    useCatalogContext();
  const { updateProduct } = useProduct();

  useEffect(() => {
    if (!isLoading && category) {
      const categoryProducts = products.filter(
        (product) => product.productType === category
      );

      if (categoryProducts.length === 0) {
        navigate(`/`);
      } else {
        fuzzySearchBrands("", category);
      }
    }
  }, [products, category, isLoading]);

  const handleSelectVariant = (variant) => {
    updateProduct(variant);
    navigate(`/`);
  };

  useHeader(category);

  return (
    <PageContainer>
      {!isLoading && (
        <div>
          <ProductSearch productType={category} />
          <ProductList
            brands={filteredBrands}
            onSelectVariant={handleSelectVariant}
          />
        </div>
      )}
      {isLoading && (
        <div>
          <ProductSearch productType={category} />
          {/* Placeholder skeletons */}
        </div>
      )}
    </PageContainer>
  );
};
