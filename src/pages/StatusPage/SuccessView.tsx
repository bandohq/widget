import { useNavigate } from "react-router-dom";
import { AccordionDetails, Avatar, Button, Typography } from "@mui/material";
import {
  CustomAccordion,
  CustomAccordionSummary,
  IconWrapper,
  ProductBox,
  StatusSubtitle,
  StatusTitle,
} from "./StatusPage.style";
import { Check, CaretDown, Barcode } from "@phosphor-icons/react";
import { palette } from "../../themes/palettes";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const SuccessView = () => {
  const [product, setProduct] = useState({
    img_url: false,
    name: "Product name",
    price: 0,
  });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const gotoHome = () => {
    navigate(navigationRoutes.home);
  };
  return (
    <>
      <IconWrapper bgColor={palette.primary.medium}>
        <Check size={50} />
      </IconWrapper>
      <StatusTitle>{t("success.title.orderCompleted")}</StatusTitle>
      <StatusSubtitle>{t("success.title.thanks")}</StatusSubtitle>

      <ProductBox>
        {!product.img_url ? (
          <Avatar alt={product.name} sx={{ bgcolor: palette.primary.main }}>
            NP
          </Avatar>
        ) : (
          <Barcode size={50} />
        )}
        <StatusTitle fontSize="26px">
          {product.name} - {"$0.00"}
        </StatusTitle>
        <StatusSubtitle fontSize="18px">
          {t("success.message.mailNotification")}
        </StatusSubtitle>
      </ProductBox>

      <CustomAccordion>
        <CustomAccordionSummary
          expandIcon={<CaretDown />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{t("success.title.orderDetails")}</Typography>
        </CustomAccordionSummary>
        <AccordionDetails>
          <Typography>Contenido de la sección 1.</Typography>
        </AccordionDetails>
      </CustomAccordion>

      <Button
        variant="contained"
        fullWidth
        style={{ borderRadius: "30px" }}
        onClick={gotoHome}
      >
        {t("button.discover")}
      </Button>
    </>
  );
};
