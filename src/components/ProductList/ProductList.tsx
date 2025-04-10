import React, { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { List, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { Brand } from "../../providers/CatalogProvider/types";
import { SettingsListItemButton } from "../SettingsListItemButton";
import { ImageAvatar } from "../Avatar/Avatar";
import { splitCamelCase } from "../../utils/truncateText";
import { VariantSelector } from "../VariantSelector/VariantSelector";
import { Variant } from "../../stores/ProductProvider/types";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";

interface ProductListProps {
  brands: Brand[];
  onSelectVariant: (variant: Variant) => void;
  isDropdown?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  brands,
  onSelectVariant,
  isDropdown = true,
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen] = useState(isDropdown);
  const { updateBrand, brand } = useProduct();

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: brands.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  const handleSelectBrand = (brand: Brand) => {
    updateBrand(brand);
    if (brand.variants.length > 1) {
      setOpen(true);
    } else {
      onSelectVariant(brand.variants[0]);
    }
  };

  return (
    <>
      <Collapse in={dropdownOpen}>
        <div ref={parentRef}>
          <List
            sx={{
              width: "100%",
              backgroundColor: "inherit",
              borderRadius: "0",
              boxShadow: "none",
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const brand = brands[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    position: "absolute",
                  }}
                >
                  <SettingsListItemButton
                    key={brand.brandSlug}
                    onClick={() => handleSelectBrand(brand)}
                  >
                    <ListItemIcon>
                      <ImageAvatar
                        hideName
                        name={brand.brandName}
                        src={brand.imageUrl}
                        sx={{
                          width: "45px",
                          height: "45px",
                          maxWidthidth: "45px",
                          maxHeight: "45px",
                          objectFit: "contain",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={splitCamelCase(brand.brandName)} />
                  </SettingsListItemButton>
                </div>
              );
            })}
          </List>
        </div>
      </Collapse>

      <VariantSelector
        open={open}
        onClose={() => setOpen(false)}
        selectedBrand={brand}
        onVariantSelect={(item) => {
          setOpen(false);
          onSelectVariant(item);
        }}
      />
    </>
  );
};
