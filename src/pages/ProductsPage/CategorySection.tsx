import { Typography, Link, useTheme } from "@mui/material";
import { BrandsContainer, BrandsGrid } from "./ProductPage.style";
import { ImageAvatar } from "../../components/Avatar/Avatar";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DialogList } from "../../components/DialogList/DialogList";
import { VariantItem } from "../../components/DialogList/VariantItem";
import { useTranslation } from "react-i18next";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { splitCamelCase } from "../../utils/truncateText";

export const CategorySection = ({ category, onMoreClick }) => {
  const { updateProduct, updateBrand } = useProduct();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const handleBrandClick = (brand) => {
    updateBrand(brand);
    if (brand.variants.length > 1) {
      setSelectedBrand(brand);
      setOpen(true);
    } else {
      updateProduct(brand.variants[0]);
      navigate(`/form`);
    }
  };

  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick(category);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 2,
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" sx={{ fontSize: "21px", fontWeight: 200 }}>
          {category.productType && t(`main.${category?.productType}`)}
        </Typography>
        {category?.showMore && (
          <Link
            component="button"
            variant="body2"
            onClick={handleMoreClick}
            sx={{
              marginLeft: 1,
              textDecoration: "none",
              color: theme.palette.primary.main,
            }}
          >
            more
          </Link>
        )}
      </div>
      <BrandsContainer>
        {category.brands.map((brand) => (
          <BrandsGrid
            key={splitCamelCase(brand.brandName)}
            onClick={() => handleBrandClick(brand)}
          >
            <ImageAvatar
              name={splitCamelCase(brand.brandName)}
              src={brand.imageUrl}
              sx={{
                maxHeight: "60px",
                maxWidth: "60px",
                width: "60px",
                height: "60px",
                objectFit: "contain",
              }}
            />
          </BrandsGrid>
        ))}
      </BrandsContainer>

      {/* Variants Dialog */}
      {selectedBrand && (
        <BottomSheet open={open} onClose={() => setOpen(false)}>
          <DialogList
            items={[...selectedBrand.variants].sort(
              (a, b) =>
                parseFloat(a.price.fiatValue) - parseFloat(b.price.fiatValue)
            )}
            onClose={() => setOpen(false)}
            title={selectedBrand?.brandName || ""}
            image={selectedBrand?.imageUrl || ""}
            renderItem={(item) => (
              <VariantItem item={item} onClose={() => setOpen(false)} />
            )}
          />
        </BottomSheet>
      )}
    </div>
  );
};
