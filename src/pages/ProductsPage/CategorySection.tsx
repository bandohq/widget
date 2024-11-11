// src/components/CategorySection.js
import { Typography } from "@mui/material";
import { ProductsGrid } from "./ProductPage.style";
import { ImageAvatar } from "../../components/Avatar/Avatar";

export const CategorySection = ({ category }) => {
  return (
    <div>
      <Typography variant="h4" sx={{ fontSize: "21px", fontWeight: 200 }}>
        {category.name}
      </Typography>
      <ProductsGrid>
        {category.products.map((product) => (
          <div key={product.id}>
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
