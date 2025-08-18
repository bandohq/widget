import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { useNotificationContext } from "../../providers/AlertProvider/NotificationProvider";

export const SuccessView = ({ status }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { showNotification } = useNotificationContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [localStatus, setLocalStatus] = useState(status);

  // Data comes from from useTransactionFlow
  const { signature, processTransactionWithReceipt, isPendingNew } =
    location.state || {};

  useEffect(() => {
    if (
      signature &&
      !isProcessing &&
      !localStatus?.status &&
      processTransactionWithReceipt
    ) {
      setIsProcessing(true);

      const processTransaction = async () => {
        try {
          await processTransactionWithReceipt(signature);
        } catch (error) {
          console.error("Error processing transaction:", error);
          setIsProcessing(false);
          showNotification("error", t("error.message.errorProcessingPurchase"));
          navigate(`${navigationRoutes.error}?error=true`);
        }
      };

      processTransaction();
    }
  }, [
    signature,
    isProcessing,
    localStatus?.status,
    processTransactionWithReceipt,
  ]);

  const isStatusCompleted =
    localStatus?.status === "COMPLETED" || status?.status === "COMPLETED";

  const gotoHome = () => {
    navigate(navigationRoutes.home);
  };

  return (
    <>
      <IconWrapper
        bgColor={isStatusCompleted ? palette.primary.main : "transparent"}
      >
        {isStatusCompleted ? (
          <Check size={50} />
        ) : (
          <AnimatedCircularProgress size={75}>
            <SpinnerGap size={75} color={palette.primary.main} />
          </AnimatedCircularProgress>
        )}
      </IconWrapper>
      <StatusTitle
        id="conversion-success-element"
        data-conversion-id={status?.transactionId || ""}
        data-transaction-status={isStatusCompleted ? "completed" : "processing"}
        data-transaction-amount={status?.fiatUnitPrice || ""}
        data-transaction-currency={status?.fiatCurrency || ""}
        data-product-type={status?.productType || ""}
        data-product-name={status?.product?.name || ""}
      >
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
              opacity: isStatusCompleted ? 1 : 0.6,
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
            productType:
              t(
                !status?.productType
                  ? "product"
                  : status?.productType === "gift_card"
                  ? `main.${status?.productType}_singular`
                  : `main.${status?.productType}`
              ) || "product",
            reference: status?.givenReference || "your reference",
            brand: status?.product?.brand || "",
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
