import { useParams } from "react-router-dom";
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

export const CategoryPage = ({ category, onBack }) => {
  const {
    allProducts,
    isPending,
    currentPage,
    totalPages,
    lastProductRef,
    setPage,
    debouncedSearch,
  } = useCategoryProducts(category.productType);

  useHeader(category.productType);

  return (
    <PageContainer>
      <Button variant="contained" onClick={onBack} sx={{ marginBottom: 2 }}>
        Back
      </Button>
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
              onClick={() => {}}
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
