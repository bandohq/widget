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
import VariantInfo from "../VariantInfo/VariantInfo";

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

  return (
    <Box sx={{ height: "80vh", overflow: "auto", mt: 2 }}>
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

        <VariantInfo variant={current} title={title} />

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
