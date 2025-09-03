import { Typography, Link, useTheme } from "@mui/material";
import { BrandsContainer, BrandsGrid } from "./ProductPage.style";
import { ImageAvatar } from "../../components/Avatar/Avatar";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { splitCamelCase } from "../../utils/truncateText";
import { VariantSelector } from "../../components/VariantSelector/VariantSelector";

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

  if (category.productType === "esim") {
    return null;
  }

  if (category.brands.length === 0) {
    return null;
  }

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
        {category.brands.map((brand, index) => (
          <BrandsGrid key={index} onClick={() => handleBrandClick(brand)}>
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
      <VariantSelector
        open={open}
        onClose={() => setOpen(false)}
        selectedBrand={selectedBrand}
        onVariantSelect={() => setOpen(false)}
      />
    </div>
  );
};
