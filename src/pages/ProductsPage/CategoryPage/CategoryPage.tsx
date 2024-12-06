import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  Avatar,
  Button,
  CircularProgress,
  List,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ImageAvatar } from "../../../components/Avatar/Avatar";
import { ProductSearch } from "../ProductSearch";
import { useHeader } from "../../../hooks/useHeader";
import { PageContainer } from "../../../components/PageContainer";
import { useCategoryProducts } from "./useCategoryProducts";
import { SettingsListItemButton } from "../../../components/SettingsListItemButton";
import { useProduct } from "../../../stores/ProductProvider/ProductProvider";

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const {
    allProducts,
    isPending,
    currentPage,
    totalPages,
    lastProductRef,
    setPage,
    debouncedSearch,
  } = useCategoryProducts(categoryName);
  const { updateProduct } = useProduct();

  const handleSelectProduct = (product) => {
    updateProduct(product);
    navigate(`/`);
  };

  useHeader(categoryName);

  return (
    <PageContainer>
      <ProductSearch onSearchChange={debouncedSearch} />
      <List
        sx={{
          paddingTop: 0,
          paddingBottom: 1.5,
        }}
      >
        {allProducts.map((product, index) => {
          const isLast = index === allProducts.length - 1;
          return (
            <SettingsListItemButton
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              ref={isLast ? lastProductRef : null}
            >
              <ListItemIcon>
                <ImageAvatar
                  name={product.brand}
                  src={product.img_url}
                  sx={{ width: "100%", height: "100%" }}
                />
              </ListItemIcon>
              <ListItemText primary={product.brand} />
            </SettingsListItemButton>
          );
        })}
      </List>

      {currentPage < totalPages && !isPending && (
        <Button
          variant="contained"
          fullWidth
          onClick={() => setPage((prev) => prev + 1)}
        >
          Load more
        </Button>
      )}

      {isPending && <CircularProgress sx={{ margin: "auto" }} />}
    </PageContainer>
  );
};
