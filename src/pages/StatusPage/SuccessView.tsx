import { useNavigate } from "react-router-dom";
import { Avatar, Button } from "@mui/material";
import {
  AnimatedCircularProgress,
  IconWrapper,
  ProductBox,
  StatusSubtitle,
  StatusTitle,
} from "./StatusPage.style";
import { Check, Barcode, SpinnerGap } from "@phosphor-icons/react";
import { palette } from "../../themes/palettes";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const SuccessView = ({ status }) => {
  const [product] = useState({
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
      <StatusTitle>
        {t(
          status?.status === "SUCCESS"
            ? "success.title.orderCompleted"
            : "success.title.orderInProgress"
        )}
      </StatusTitle>
      {status?.status !== "SUCCESS" && (
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <AnimatedCircularProgress>
            <SpinnerGap size={25} color={palette.primary.main} />
          </AnimatedCircularProgress>
          <StatusSubtitle fontSize={"14px"}>{status?.status}</StatusSubtitle>
        </div>
      )}
      <StatusSubtitle fontSize={"16px"}>
        {t(
          status?.status === "SUCCESS"
            ? "success.title.thanks"
            : "sucess.title.paymentReceived"
        )}
      </StatusSubtitle>

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
          {t("success.message.notification", {
            productType: status?.product_type || "item",
            reference: status?.email || "your reference",
          })}
        </StatusSubtitle>
      </ProductBox>

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
