import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  List,
  ListItemIcon,
  ListItemText,
  Skeleton,
  ListItem,
} from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ImageAvatar } from "../../../components/Avatar/Avatar";
import { ProductSearch } from "../ProductSearch";
import { useHeader } from "../../../hooks/useHeader";
import { PageContainer } from "../../../components/PageContainer";
import { SettingsListItemButton } from "../../../components/SettingsListItemButton";
import { useProduct } from "../../../stores/ProductProvider/ProductProvider";
import { useCatalogContext } from "../../../providers/CatalogProvider/CatalogProvider";
import { Dialog } from "../../../components/Dialog";
import { DialogList } from "../../../components/DialogList/DialogList";
import { VariantItem } from "../../../components/DialogList/VariantItem";

export const CategoryPage = () => {
  const [onlyBrands, setOnlyBrands] = useState({ brands: [] });
  const [open, setOpen] = useState(false);
  const { category } = useParams();
  const navigate = useNavigate();
  const { products, isLoading, setSearchQuery } = useCatalogContext();
  const { updateProduct, brand, updateBrand } = useProduct();

  // Filter data by category
  useEffect(() => {
    if (!isLoading && products.length === 0) {
      return;
    }
    const cat = products.filter((product) => product.productType === category);
    if (cat.length === 0) {
      navigate(`/`);
    } else {
      setOnlyBrands(cat[0]);
    }
  }, [products, category, isLoading]);

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: onlyBrands.brands.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 30,
    overscan: 5,
  });

  const handleSelectBrand = (brand) => {
    updateBrand(brand);
    if (brand.variants.length > 1) {
      setOpen(true);
    } else {
      updateProduct(brand.variants[0]);
      navigate(`/`);
    }
  };

  useHeader(category);

  return (
    <PageContainer>
      {!isLoading && onlyBrands.brands.length > 0 && (
        <div>
          <ProductSearch onSearchChange={setSearchQuery} products={[]} />
          <div ref={parentRef}>
            <List
              sx={{
                paddingTop: 0,
                paddingBottom: 1.5,
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const product = onlyBrands.brands[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <SettingsListItemButton
                      key={product.brandSlug}
                      onClick={() => handleSelectBrand(product)}
                    >
                      <ListItemIcon>
                        <ImageAvatar
                          name={product.brandName}
                          src={product.imageUrl}
                          sx={{ width: "45px", height: "45px" }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={product.brandSlug} />
                    </SettingsListItemButton>
                  </div>
                );
              })}
            </List>
          </div>
        </div>
      )}
      {isLoading && (
        <div>
          <ProductSearch onSearchChange={setSearchQuery} />
          <List>
            {Array.from({ length: 8 }).map((_, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemIcon>
                  <Skeleton variant="circular" width={60} height={60} />
                </ListItemIcon>
                <ListItemText
                  primary={<Skeleton variant="text" width="80%" height={20} />}
                  secondary={
                    <Skeleton variant="text" width="60%" height={20} />
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      )}
      {brand && (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogList
            items={brand?.variants || []}
            onClose={() => setOpen(false)}
            title={brand?.brandName || ""}
            image={brand?.imageUrl || ""}
            renderItem={(item) => (
              <VariantItem item={item} onClose={() => setOpen(false)} />
            )}
          />
        </Dialog>
      )}
    </PageContainer>
  );
};
