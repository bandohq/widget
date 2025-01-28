import React, { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { List, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { Brand, Variant } from "../../providers/CatalogProvider/types";
import { SettingsListItemButton } from "../SettingsListItemButton";
import { ImageAvatar } from "../Avatar/Avatar";
import { Dialog } from "../Dialog";
import { DialogList } from "../DialogList/DialogList";
import { VariantItem } from "../DialogList/VariantItem";

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
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: brands.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  const handleSelectBrand = (brand: Brand) => {
    if (brand.variants.length > 1) {
      setSelectedBrand(brand);
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
                    <ListItemText primary={brand.brandName} />
                  </SettingsListItemButton>
                </div>
              );
            })}
          </List>
        </div>
      </Collapse>

      {selectedBrand && (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogList
            items={selectedBrand.variants}
            onClose={() => setOpen(false)}
            title={selectedBrand.brandName}
            image={selectedBrand.imageUrl}
            renderItem={(item: Variant) => (
              <VariantItem
                item={item}
                onClose={() => {
                  setOpen(false);
                  onSelectVariant(item);
                }}
              />
            )}
          />
        </Dialog>
      )}
    </>
  );
};
