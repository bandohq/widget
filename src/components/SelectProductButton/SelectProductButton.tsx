import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { FormTypeProps } from "../../stores/form/types.js";
import { navigationRoutes } from "../../utils/navigationRoutes.js";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { AvatarBadgedDefault } from "../Avatar/Avatar";
import { CardTitle } from "../Card/CardTitle";
import {
  CardContent,
  SelectProductCard,
  SelectProductCardHeader,
} from "./SelectProductButton.style.js";
import { CaretDown, ShoppingCart } from "@phosphor-icons/react";
import { useTheme } from "@mui/system";
import { VariantSelector } from "../VariantSelector/VariantSelector.js";
import { useTranslation } from "react-i18next";

export const SelectProductButton: React.FC<
  FormTypeProps & { compact: boolean }
> = ({ formType, compact, readOnly }) => {
  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const { t } = useTranslation();
  const { product, brand: selectedBrand, updateProduct } = useProduct();
  const navigate = useNavigate();
  const { palette } = useTheme();

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (readOnly) return;
    setOpen(true);
  };

  const handleVariantSelect = (item: any) => {
    updateProduct(item);
    setOpen(false);
    navigate(navigationRoutes.home);
  };

  const renderAvatar = () =>
    product ? (
      <Avatar variant="rounded" alt={product.name} src={product.imageUrl} />
    ) : (
      <AvatarBadgedDefault />
    );

  const renderActionButton = () => (
    <Button
      size="small"
      onClick={readOnly ? undefined : handleButtonClick}
      sx={{
        fontSize: "12px",
        color: palette.text.primary,
        fontWeight: 400,
        backgroundColor: palette.background.default,
      }}
    >
      {`${parseFloat(product?.price?.fiatValue).toFixed(2)} ${
        product?.price?.fiatCurrency
      }`}
      <CaretDown size="18px" style={{ margin: "auto", paddingLeft: 5 }} />
    </Button>
  );

  console.log(selectedBrand, product);

  return (
    <>
      <SelectProductCard>
        <CardContent
          formType={formType}
          compact={compact}
          onClick={readOnly ? undefined : () => navigate(navigationRoutes.home)}
        >
          <CardTitle>{t("header.yourProduct")}</CardTitle>
          <SelectProductCardHeader
            avatar={
              product ? (
                renderAvatar()
              ) : (
                <Avatar>
                  <ShoppingCart size={24} weight="bold" />
                </Avatar>
              )
            }
            action={product && renderActionButton()}
            title={selectedBrand?.brandName || "Select product"}
            subheader={
              product
                ? `${t(`main.${product?.productType}`)} in ${product.country}`
                : undefined
            }
            compact={compact}
          />
        </CardContent>
        {product && product?.productType === "topup" && product?.notes && (
          <Accordion
            sx={{ border: "none", margin: "none" }}
            expanded={openDetails}
            onChange={() => setOpenDetails(!openDetails)}
          >
            <AccordionSummary
              sx={{ border: "none", padding: "0px 10px", margin: "0px" }}
              expandIcon={<CaretDown size="18px" />}
            >
              <Typography>{t("form.info.productDetail")}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{product?.notes}</Typography>
            </AccordionDetails>
          </Accordion>
        )}
      </SelectProductCard>

      <VariantSelector
        open={open}
        onClose={() => setOpen(false)}
        selectedBrand={selectedBrand}
        onVariantSelect={(item) => handleVariantSelect(item)}
      />
    </>
  );
};
