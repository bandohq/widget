import { Avatar, Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { FormTypeProps } from "../../stores/form/types.js";
import { navigationRoutes } from "../../utils/navigationRoutes.js";
import { AvatarBadgedDefault, AvatarBadgedSkeleton } from "../Avatar/Avatar";
import { TokenAvatar } from "../Avatar/TokenAvatar";
import { CardTitle } from "../Card/CardTitle";
import {
  CardContent,
  SelectProductCard,
  SelectProductCardHeader,
} from "./SelectProductButton.style.js";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { ShoppingCart } from "@phosphor-icons/react";

export const SelectProductButton: React.FC<
  FormTypeProps & {
    compact: boolean;
  }
> = ({ formType, compact }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { product } = useProduct();

  const handleClick = () => {
    navigate(navigationRoutes.products);
  };

  const cardTitle: string = "You spend";

  return (
    <SelectProductCard onClick={handleClick}>
      <CardContent formType={formType} compact={compact}>
        <CardTitle>{cardTitle}</CardTitle>
        {!product ? (
          <SelectProductCardHeader
            avatar={
              <Avatar>
                <ShoppingCart size={24} weight="bold" />
              </Avatar>
            }
            title="Select product"
          />
        ) : (
          <SelectProductCardHeader
            avatar={
              product ? (
                <Avatar alt={product.name} src={product.imageUrl} />
              ) : (
                <AvatarBadgedDefault />
              )
            }
            title={product.brand}
            subheader={`${product?.productType} in ${product?.country}`}
            compact={compact}
          />
        )}
      </CardContent>
    </SelectProductCard>
  );
};
