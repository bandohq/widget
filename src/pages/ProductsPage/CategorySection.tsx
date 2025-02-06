import { Typography, Link } from "@mui/material";
import { BrandsContainer, BrandsGrid } from "./ProductPage.style";
import { ImageAvatar } from "../../components/Avatar/Avatar";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog } from "../../components/Dialog";
import { DialogList } from "../../components/DialogList/DialogList";
import { VariantItem } from "../../components/DialogList/VariantItem";
import { convertSlugToTitle } from "../../utils/slugToTitle";
import { useTranslation } from "react-i18next";

export const CategorySection = ({ category, onMoreClick }) => {
  const { updateProduct, updateBrand } = useProduct();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 2,
        justifyContent: 'space-between'
      }}>
        <Typography variant="h4" sx={{ fontSize: "21px", fontWeight: 200 }}>
          {category.productType && t(`main.${category?.productType}`)}
        </Typography>
        {category?.showMore && (
          <Link
            component="button"
            variant="body2"
            onClick={handleMoreClick}
            sx={{ marginLeft: 1 }}
          >
            more
          </Link>
        )}
      </div>
      <BrandsContainer>
        {category.brands.map((brand) => (
          <BrandsGrid
            key={brand.brandName}
            onClick={() => handleBrandClick(brand)}
          >
            <ImageAvatar
              name={brand.brandName}
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
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogList
            items={selectedBrand?.variants || []}
            onClose={() => setOpen(false)}
            title={selectedBrand?.brandName || ""}
            image={selectedBrand?.imageUrl || ""}
            renderItem={(item) => (
              <VariantItem item={item} onClose={() => setOpen(false)} />
            )}
          />
        </Dialog>
      )}
    </div>
  );
};
