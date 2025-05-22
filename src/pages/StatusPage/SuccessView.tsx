import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
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
import { ImageAvatar } from "../../components/Avatar/Avatar";

export const SuccessView = ({ status }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isStatusCompleted = status?.status === "COMPLETED";

  const gotoHome = () => {
    navigate(navigationRoutes.home);
  };
  return (
    <>
      <IconWrapper
        bgColor={isStatusCompleted ? palette.success.main : "transparent"}
      >
        {isStatusCompleted ? (
          <Check size={50} />
        ) : (
          <AnimatedCircularProgress size={75}>
            <SpinnerGap size={75} color={palette.primary.main} />
          </AnimatedCircularProgress>
        )}
      </IconWrapper>
      <StatusTitle>
        {t(
          isStatusCompleted
            ? "success.title.orderCompleted"
            : "success.title.orderInProgress"
        )}
      </StatusTitle>
      <StatusSubtitle fontSize={"16px"}>
        {t(
          isStatusCompleted
            ? "success.title.thanks"
            : "success.title.paymentReceived"
        )}
      </StatusSubtitle>
      <ProductBox>
        {status?.product?.logoUrl ? (
          <ImageAvatar
            hideName
            name={status?.product?.name || ""}
            src={status?.product?.logoUrl}
            sx={{
              filter: isStatusCompleted ? "none" : "grayscale(40%)",
              transition: "all 0.3s ease",
              maxHeight: "75px",
              objectFit: "contain",
              margin: "auto",
            }}
          />
        ) : (
          <Barcode size={50} />
        )}
        <StatusTitle fontSize="26px" isCompleted={isStatusCompleted}>
          {status?.productType &&
            t(`main.${status?.productType}`) + " " + status?.product?.name}
          {" - "}
          {isStatusCompleted &&
            status?.fiatUnitPrice + "" + status?.fiatCurrency}
        </StatusTitle>
        <StatusSubtitle fontSize="18px" isCompleted={isStatusCompleted}>
          {t("success.message.notification", {
            productType: status?.productType || "item",
            reference: status?.givenReference || "your reference",
          })}
        </StatusSubtitle>
      </ProductBox>

      <Button
        variant="contained"
        disabled={!isStatusCompleted}
        fullWidth
        style={{ borderRadius: "30px" }}
        onClick={gotoHome}
      >
        {t("button.backToHome")}
      </Button>
    </>
  );
};
