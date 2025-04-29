import * as React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Variant } from "../../stores/ProductProvider/types";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { navigationRoutes } from "../../utils/navigationRoutes";
import { useNavigate } from "react-router-dom";

interface VariantInfoProps {
  variant: Variant;
  title?: string;
}

export default function VariantInfo({ variant, title }: VariantInfoProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updateProduct } = useProduct();

  const isValidValue = (val) =>
    val !== undefined && val !== null && val !== "" && val !== "0";

  const renderFeature = (
    title: string,
    isUnlimited,
    value,
    unlimitedTransKey,
    valueTransKey,
    valueParam
  ) => {
    if (isUnlimited) {
      return (
        <Typography variant="body1" color="text.secondary" textAlign="left">
          <span style={{ fontWeight: "bold" }}>{t(unlimitedTransKey)}</span>
        </Typography>
      );
    } else if (isValidValue(value)) {
      return (
        <Typography variant="body1" color="text.secondary" textAlign="left">
          <span style={{ fontWeight: "bold" }}>{t(title)}</span>:{" "}
          {t(valueTransKey, { [valueParam]: value })}
        </Typography>
      );
    }
    return null;
  };

  const handleContinue = () => {
    updateProduct(variant);
    navigate(navigationRoutes.form);
  };

  return (
    <>
      <Typography variant="body1" align="left">
        Description
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="left">
        {variant?.notes
          ? variant?.notes
          : t("form.info.topupSliderGenericDesc", {
              amount: parseFloat(variant?.price?.fiatValue || "0").toFixed(2),
              currency: variant?.price?.fiatCurrency,
              brand: title,
            })}
      </Typography>

      <Box
        sx={{
          display: "grid",
          justifyContent: "start",
          gridTemplateColumns: "1fr",
        }}
      >
        {renderFeature(
          "data",
          variant?.dataUnlimited,
          variant?.dataGB,
          "form.info.unlimitedGB",
          "form.info.gbQuantity",
          "quantity"
        )}
        {renderFeature(
          "voice",
          variant?.voiceUnlimited,
          variant?.voiceMinutes,
          "form.info.unlimitedCalls",
          "form.info.callQuantity",
          "quantity"
        )}
        {renderFeature(
          "sms",
          variant?.smsUnlimited,
          variant?.smsNumber,
          "form.info.unlimitedSMS",
          "form.info.smsQuantity",
          "quantity"
        )}
        {isValidValue(variant?.durationDays) && (
          <Typography variant="body1" color="text.secondary" textAlign="left">
            <span style={{ fontWeight: "bold" }}>{t("duration")}</span>:{" "}
            {t("form.info.duration", { duration: variant?.durationDays })}
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        disabled={!variant}
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleContinue}
      >
        {t("common.continue")}
      </Button>
    </>
  );
}
