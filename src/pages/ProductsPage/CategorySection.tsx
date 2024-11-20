// src/components/CategorySection.js
import { Typography } from "@mui/material";
import { ProductsGrid } from "./ProductPage.style";
import { ImageAvatar } from "../../components/Avatar/Avatar";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useNavigate } from "react-router-dom";

export const CategorySection = ({ category }) => {
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
        {category.products.map((product) => (
          <div key={product.id} onClick={() => handleProductClick(product)}>
            {!product.img_url && (
              <ImageAvatar
                name={product.name}
                src={product.img_url}
                sx={{ width: "100%", height: "100%" }}
              />
            )}
          </div>
        ))}
      </ProductsGrid>
    </div>
  );
};
