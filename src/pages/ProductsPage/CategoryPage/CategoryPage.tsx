import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductSearch } from "../ProductSearch";
import { PageContainer } from "../../../components/PageContainer";
import { useHeader } from "../../../hooks/useHeader";
import { useCatalogContext } from "../../../providers/CatalogProvider/CatalogProvider";
import { useCountryContext } from "../../../stores/CountriesProvider/CountriesProvider";
import { useProduct } from "../../../stores/ProductProvider/ProductProvider";
import { ProductList } from "../../../components/ProductList/ProductList";
import { useTranslation } from "react-i18next";
import { CountriesError } from "../../../components/CountriesError/CountriesError";

export const CategoryPage = () => {
  const { category } = useParams(); // productType
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    products,
    filteredBrands,
    fuzzySearchBrands,
    isLoading,
    error: catalogError,
  } = useCatalogContext();
  const { error: countryError, retryFetch } = useCountryContext();
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
  }, [products, category, isLoading, fuzzySearchBrands, navigate]);

  const handleSelectVariant = (variant) => {
    updateProduct(variant);
    navigate(`/form`);
  };

  useHeader(t(`main.${category}`));

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
        <div
          style={{
            height: "550px",
            overflow: "auto",
            paddingBottom: "10px",
            scrollbarWidth: "none",
          }}
        >
          <ProductSearch productType={category} />
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>{t("error.message.unknown")}</p>
          </div>
        </div>
      </PageContainer>
    );
  }

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
          <ProductSearch productType={category} />
          {/* Placeholder skeletons */}
        </div>
      )}
    </PageContainer>
  );
};
