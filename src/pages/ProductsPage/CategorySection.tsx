// src/components/CategorySection.js
import React, { useState } from "react";
import { Typography, Link } from "@mui/material";
import { BrandsContainer, BrandsGrid } from "./ProductPage.style";
import { ImageAvatar } from "../../components/Avatar/Avatar";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useNavigate } from "react-router-dom";
import { CategoryPage } from "./CategoryPage/CategoryPage";

export const CategorySection = ({ category, onMoreClick }) => {
  const { setSelectedProduct } = useProduct();
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate(`/`);
  };

  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick(category);
    }
  };

  return (
    <div>
      <Typography
        variant="h4"
        sx={{ fontSize: "21px", fontWeight: 200, marginBottom: 2 }}
      >
        {category.name}
      </Typography>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <div>{category.productType}</div>
        <Link
          component="button"
          variant="body2"
          onClick={handleMoreClick}
          sx={{ marginLeft: 1 }}
        >
          more
        </Link>
      </div>
      <BrandsContainer>
        {category.brands.map((brand) => (
          <BrandsGrid
            key={brand.brandName}
            onClick={() => handleProductClick(brand)}
          >
            {!brand.imageUrl && (
              <ImageAvatar
                name={brand.brandName}
                src={brand.imageUrl}
                sx={{ width: "100%", height: "100%" }}
              />
            )}
          </BrandsGrid>
        ))}
      </BrandsContainer>
    </div>
  );
};
