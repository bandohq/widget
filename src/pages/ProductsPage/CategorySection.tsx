// src/components/CategorySection.js
import { Typography } from "@mui/material";
import { ProductsGrid } from "./ProductPage.style";
import { ImageAvatar } from "../../components/Avatar/Avatar";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useNavigate } from "react-router-dom";

export const CategorySection = ({ key, category }) => {
  const { setSelectedProduct } = useProduct();
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    setSelectedProduct(product);

    navigate(`/`);
  };

  return (
    <div>
      <Typography
        variant="h4"
        sx={{ fontSize: "21px", fontWeight: 200, marginBottom: 2 }}
      >
        {category.name}
      </Typography>
      <ProductsGrid>
        { category.productType }
        {category.brands.map((brand) => (
          <div key={brand.brandName} onClick={() => handleProductClick(brand)}>
            {!brand.imageUrl && (
              <ImageAvatar
                name={brand.brandName}
                src={brand.imageUrl}
                sx={{ width: "100%", height: "100%" }}
              />
            )}
          </div>
        ))}
      </ProductsGrid>
    </div>
  );
};
