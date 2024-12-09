import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  List,
  ListItemIcon,
  ListItemText,
  Skeleton,
  ListItem
} from "@mui/material";
import { useVirtualizer } from '@tanstack/react-virtual';
import { ImageAvatar } from "../../../components/Avatar/Avatar";
import { ProductSearch } from "../ProductSearch";
import { useHeader } from "../../../hooks/useHeader";
import { PageContainer } from "../../../components/PageContainer";
import { SettingsListItemButton } from "../../../components/SettingsListItemButton";
import { useProduct } from "../../../stores/ProductProvider/ProductProvider";
import { useCatalogContext } from "../../../providers/CatalogProvider/CatalogProvider";

export const CategoryPage = () => {
  const [onlyBrands, setOnlyBrands] = useState({ brands: [] });
  const { category } = useParams();
  const navigate = useNavigate();
  const { products, isLoading, setSearchQuery } = useCatalogContext();

  //Filter data by category
  useEffect(() => {
    if(!isLoading && products.length === 0) {
      return;
    }
    const cat = products.filter((product) => product.productType === category);
    setOnlyBrands(cat[0]);
  }, [products, category, isLoading]);

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: onlyBrands.brands.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  const { updateProduct } = useProduct();

  const handleSelectProduct = (product) => {
    updateProduct(product);
    navigate(`/`);
  };

  useHeader(category);

  return (
    <PageContainer>
      { !isLoading && onlyBrands.brands.length > 0 && (
        <div>
          <ProductSearch onSearchChange={setSearchQuery} />
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
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <SettingsListItemButton
                      key={product.brandSlug}
                      onClick={() => handleSelectProduct(product)}
                    >
                      <ListItemIcon>
                        <ImageAvatar
                          name={product.brandName}
                          src={product.imageUrl}
                          sx={{ width: "60px", height: "60px" }}
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
          {/* Skeleton Loader */}
          <List>
            {Array.from({ length: 8 }).map((_, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemIcon>
                  <Skeleton variant="circular" width={60} height={60} />
                </ListItemIcon>
                <ListItemText
                  primary={<Skeleton variant="text" width="80%" height={20} />}
                  secondary={<Skeleton variant="text" width="60%" height={20} />}
                />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </PageContainer>
  );
};
