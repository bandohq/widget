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
import { ImageAvatar } from "../../components/Avatar/Avatar";
import { Box } from "@mui/system";

export const SuccessView = ({ status }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isStatusCompleted = status?.status === "COMPLETED";

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
          isStatusCompleted
            ? "success.title.orderCompleted"
            : "success.title.orderInProgress"
        )}
      </StatusTitle>
      {!isStatusCompleted && (
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
          isStatusCompleted
            ? "success.title.thanks"
            : "success.title.paymentReceived"
        )}
      </StatusSubtitle>
      <ProductBox>
        {!status?.product?.logo_url ? (
          <Box
            sx={{
              width: "40%",
              height: "50px",
            }}
          >
            <ImageAvatar
              hideName
              name={status?.product?.name || ""}
              src={status?.product?.logoUrl}
              sx={{
                width: "50%",
                height: "45px",
                maxWidthidth: "45px",
                maxHeight: "45px",
                objectFit: "contain",
                margin: "auto",
              }}
            />
          </Box>
        ) : (
          <Barcode size={50} />
        )}
        <StatusTitle fontSize="26px">
          {t(`main.${status?.productType}`) + " " + status?.product?.name}
          {" - "}
          {isStatusCompleted &&
            status?.fiatUnitPrice + "" + status?.fiatCurrency}
        </StatusTitle>
        <StatusSubtitle fontSize="18px">
          {t("success.message.notification", {
            productType: status?.productType || "item",
            reference: status?.givenReference || "your reference",
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
