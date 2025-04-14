import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { Button, IconButton } from "@mui/material";
import { StyledCard } from "./VariantSlider.styles";
import CloseIcon from "@mui/icons-material/Close";
import { useProduct } from "../../stores/ProductProvider/ProductProvider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Variant } from "../../stores/ProductProvider/types";

interface VariantSliderProps {
  variants: Variant[];
  title: string;
  onClose: () => void;
}

export default function VariantSlider({
  variants,
  title,
  onClose,
}: VariantSliderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [index, setIndex] = React.useState(0);
  const { updateProduct } = useProduct();

  if (!variants || variants.length === 0) return null;

  console.log(variants);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setIndex(newValue);
    }
  };

  const handleSelectVariant = (variant) => {
    updateProduct(variant);
    onClose();
    navigate(`/form`);
  };

  const isValidValue = (val) =>
    val !== undefined && val !== null && val !== "" && val !== "0";

  const current = variants[index];

  const renderFeature = (
    isUnlimited,
    value,
    unlimitedTransKey,
    valueTransKey,
    valueParam
  ) => {
    if (isUnlimited) {
      return (
        <Typography variant="body1" color="text.secondary">
          {t(unlimitedTransKey)}
        </Typography>
      );
    } else if (isValidValue(value)) {
      return (
        <Typography variant="body1" color="text.secondary">
          {t(valueTransKey, { [valueParam]: value })}
        </Typography>
      );
    }
    return null;
  };

  return (
    <Box sx={{ height: "65vh", overflow: "auto", mt: 2 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "12px 12px 0 0",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <Box
        sx={{
          width: 300,
          mx: "auto",
          height: "85%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" gutterBottom align="center">
          {title}
        </Typography>

        <StyledCard sx={{ mb: 3 }}>
          <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Avatar
              src={current?.imageUrl}
              alt="logo"
              variant="square"
              sx={{ width: 56, height: 56 }}
            />
            <Box>
              <Typography variant="h6" color="primary">
                {!isNaN(parseFloat(current?.price?.fiatValue || "0"))
                  ? parseFloat(current?.price?.fiatValue || "0").toFixed(2)
                  : "0.00"}{" "}
                {current?.price.fiatCurrency}
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>

        <Slider
          value={index}
          min={0}
          step={1}
          max={variants.length - 1}
          onChange={handleChange}
          valueLabelFormat={(i) => variants[i].shortNotes}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ height: "40%" }}
        >
          {current?.notes
            ? current?.notes
            : t("form.info.topupSliderGenericDesc", {
                amount: parseFloat(current?.price?.fiatValue || "0").toFixed(2),
                currency: current?.price?.fiatCurrency,
                brand: title,
              })}
        </Typography>

        <Box
          sx={{
            height: 50,
            display: "grid",
            justifyContent: "center",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {renderFeature(
            current?.dataUnlimited,
            current?.dataGB,
            "form.info.unlimitedGB",
            "form.info.gbQuantity",
            "quantity"
          )}
          {renderFeature(
            current?.voiceUnlimited,
            current?.voiceMinutes,
            "form.info.unlimitedCalls",
            "form.info.callQuantity",
            "quantity"
          )}
          {renderFeature(
            current?.smsUnlimited,
            current?.smsNumber,
            "form.info.unlimitedSMS",
            "form.info.smsQuantity",
            "quantity"
          )}
          {isValidValue(current?.durationDays) && (
            <Typography variant="body1" color="text.secondary">
              {t("form.info.duration", { duration: current?.durationDays })}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{ mt: "auto" }}
          onClick={() => handleSelectVariant(current)}
        >
          {t("form.info.buy")}
        </Button>
      </Box>
    </Box>
  );
}
